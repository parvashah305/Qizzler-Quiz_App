import { useForm } from "react-hook-form";
import Modal from "./Modal";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Cookies from 'universal-cookie';


const AuthModals = ({ isLoginOpen, isSignupOpen, onCloseLogin, onCloseSignup, openSignup, openLogin }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate= useNavigate()

  const onLoginSubmit = async(data) => {
    console.log("Login Data:", data);

    const userInfo={
        email:data.email,
        password:data.password
    }

    try {
        const res= await fetch("https://qizzler-backend.vercel.app/loginuser",{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
              },
            credentials:"include",
            body:JSON.stringify(userInfo)
        })

        const result=await res.json()

        const cookies = new Cookies();
        cookies.set('token', token, {path:'/'})
       
        console.log("Token:",result.token)

        if(res.ok){
            toast.success("Login Successfull",{
                position:"top-center",
                autoClose:"3000",
                theme:"light"
              })
              setTimeout(()=>{
                navigate('/')
              },3000)
        }
        else{
            toast.error(result.message,{
                position:"top-center",
                autoClose:"3000",
                theme:"light"
              })
        }
    } catch (error) {
        toast.error(error,{
            position:"top-center",
            autoClose:"3000",
            theme:"light"
          })
    }
  };

  const onSignupSubmit = async(data) => {
    console.log("Signup Data:", data);

    const userInfo={
        name:data.name,
        email:data.email,
        password:data.password
    }

    try {
        const res=await fetch("https://qizzler-backend.vercel.app/registeruser",{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            },
            credentials:"include",
            body:JSON.stringify(userInfo)
        })

        const result=await res.json()
        if(res.ok){
            toast.success("SignUp Successfull",{
                position:"top-center",
                autoClose:"3000",
                theme:"light"
              })
              setTimeout(()=>{
                navigate('/')
              },3000)
        }
        else{
            toast.error(result.message,{
                position:"top-center",
                autoClose:"3000",
                theme:"light"
              })
        }
    } catch (error) {
        toast.error(error,{
            position:"top-center",
            autoClose:"3000",
            theme:"light"
          })
    }
  };

  return (
    <>

      <Modal isOpen={isLoginOpen} onClose={onCloseLogin}>
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <form onSubmit={handleSubmit(onLoginSubmit)} className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            {...register("email", { required: "Email is required" })}
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
          />
          {errors.email && <p className="text-red-500">{errors.email.message}</p>}

          <input
            type="password"
            placeholder="Password"
            {...register("password", { required: "Password is required" })}
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
          />
          {errors.password && <p className="text-red-500">{errors.password.message}</p>}

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 py-2 rounded">
            Login
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          Not registered?{" "}
          <button onClick={() => { onCloseLogin(); openSignup(); }} className="text-blue-400 underline">
            Sign up
          </button>
        </p>
      </Modal>


      <Modal isOpen={isSignupOpen} onClose={onCloseSignup}>
        <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
        <form onSubmit={handleSubmit(onSignupSubmit)} className="space-y-3">
          <input
            type="text"
            placeholder="Full Name"
            {...register("name", { required: "Name is required" })}
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}

          <input
            type="email"
            placeholder="Email"
            {...register("email", { required: "Email is required" })}
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
          />
          {errors.email && <p className="text-red-500">{errors.email.message}</p>}

          <input
            type="password"
            placeholder="Password"
            {...register("password", { required: "Password is required", minLength: { value: 6, message: "At least 6 characters" } })}
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
          />
          {errors.password && <p className="text-red-500">{errors.password.message}</p>}

          <button type="submit" className="w-full bg-green-600 hover:bg-green-500 py-2 rounded">
            Sign Up
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <button 
            onClick={() => { 
              onCloseSignup(); 
              openLogin(); 
            }} 
            className="text-blue-400 underline"
          >
            Login
          </button>
        </p>
      </Modal>
    </>
  );
};

export default AuthModals;