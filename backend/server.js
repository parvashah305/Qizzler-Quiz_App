const express=require('express')
const mongoose = require('mongoose')
const bcryptjs=require('bcryptjs')
const cookieParser=require('cookie-parser')
const cors=require('cors')
const User=require('./models/UserSchema')
const Quiz=require("./models/QuizSchema")
const jwt=require('jsonwebtoken')
require("dotenv").config()

const app=express()
const PORT=4000

app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = ['https://qizzler.vercel.app'];
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));
app.use(express.json())
app.use(cookieParser())

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB Connected"))
.catch(()=>console.log("Error"))

app.post('/registeruser',async(req,res)=>{

    try {
        const {name,email,password}=req.body
        if(!name||!email||!password){
            return res.status(400).json({message:"All fields are required"})
        }
        const userExist= await User.findOne({email})

        if(userExist){
            return res.status(400).json({message:"User already exist with this email"})
        }

        const hashedPassword=await bcryptjs.hash(password,10)
    
        const newUser=await new User({
            name,
            email,
            password:hashedPassword
        })
    
        await newUser.save()

        return res.status(200).json({message:"User Registered Successfully"})
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Internal Server Error"})
        
    }
    
})

app.post('/loginuser',async(req,res)=>{
    try {
        const {email,password}=req.body
        if(!email||!password){
          return  res.status(400).json({message:"All fields are required"})
        }

        const user= await User.findOne({email})

        if(!user){
            return res.status(400).json({message:"User does not exist"})
        }

        const passMatch= await bcryptjs.compare(password,user.password)

        if(!passMatch){
            return res.status(400).json({message:"Email or Password is Incorrect"})
        }

        const token=jwt.sign(
            { id: user._id, name: user.name, email: user.email },
            process.env.JWT_SECRET_KEY,
            {expiresIn:'24h'}
        )

        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none',
            maxAge: 24 * 60 * 60 * 1000,
        });

        res.status(200).json({token,message:"LoggedIn Successfully"})
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Internal Server Error"})
    }
})

app.get("/checkAuth", (req, res) => {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ message: "Not logged in" });
    }
  
    try {
      const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
      res.status(200).json({ message: "Authenticated", user: verified });
    } catch (error) {
      res.status(403).json({ message: "Invalid token" });
    }
  });

  app.post("/logout", (req, res) => {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    });
  
    res.status(200).json({ message: "Logged out successfully" });
  });


app.post('/quizzes',async(req,res)=>{
    try {
        const token=req.cookies.jwt
        if(!token){
            return res.status(400).json({ message: "Authorization token is missing." });
        }

        const decoded=jwt.verify(token,process.env.JWT_SECRET_KEY)
        const userId=decoded.id

        const user= await User.findById(userId)
        if(!user){
            return res.status(400).json({message:"User not Found"})
        }

        const {title,questions}=req.body
        if(!title||!questions||questions.length===0){
            return res.status(400).json ({message:'Title and Questions are required'})
        }
        
        for (const q of questions){
            if(!q.questionText||!q.options||q.options.length<2||!q.correctAnswer){
                return res.status(400).json({message:"Each Questions must have text, atleast two options and a correct Answer"})
            }
        }

        const newQuiz=new Quiz({
            title,
            questions,
            creator: userId
        })

        await newQuiz.save()

        return res.status(200).json({message:"Quiz added Successfully"})

    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Internal Server Error"})
    }
})

app.get('/getquizzes',async(req,res)=>{
    try {
        const token=req.cookies.jwt
        if(!token){
            return res.status(400).json({message:"Authorization token missing"})
        }

        const decoded=jwt.verify(token,process.env.JWT_SECRET_KEY)
        const userId=decoded.id

        const quizzes=await Quiz.find({creator:userId})

        return res.status(200).json({message:"Quizz Fetched Successfully",quizzes})
    } catch (error) {
        console.log(error)
        return res.status(400).json({message:"Internal Server Error"})
    }
})

app.get("/getallquizzes", async (req, res) => {
    try {
      const quizzes = await Quiz.find().populate("creator", "name");
  
      return res.status(200).json({
        message: "Quizzes Fetched Successfully",
        quizzes: quizzes.map((quiz) => ({
          _id: quiz._id,
          title: quiz.title,
          creatorName: quiz.creator.name ,
          questionsCount: quiz.questions.length,
        })),
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  });

  app.get('/quizzes/:id',async(req,res)=>{
   try {
    const quizId= req.params.id
    const quiz=await Quiz.findById(quizId).populate("creator","name")
    if(!quiz){
        return res.status(400).json({message:"Quiz not found"})
    }
    return res.status(200).json({message:"Quiz fetched Successfully",  quiz: {
        _id: quiz._id,
        title: quiz.title,
        creatorName: quiz.creator?.name || "Unknown",
        questions: quiz.questions,
      },})
   } catch (error) {
    console.log(error)
    return res.status(500).json({message:"Internal Server Error"})
   }
  })

  app.post('/quizzes/:id/submit', async (req, res) => {
    try {
        const quizId = req.params.id;
        const selectedAnswers = req.body.answers; // Expecting array of {questionId, selectedOption}

        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({ message: "Quiz Not Found" });
        }

        let correctCount = 0;

        for (const answer of selectedAnswers) {
            const question = quiz.questions.find(q => q._id.toString() === answer.questionId);
            if (question && question.correctAnswer === answer.selectedOption) {
                correctCount++;
            }
        }

        const totalQuestions = quiz.questions.length;
        const score = (correctCount / totalQuestions) * 100;

        return res.status(200).json({
            message: "Quiz submitted successfully",
            totalQuestions,
            correctAnswers: correctCount,
            score: score.toFixed(2)
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

app.listen(PORT,()=>{
    console.log(`Server Running on ${PORT}`)
})