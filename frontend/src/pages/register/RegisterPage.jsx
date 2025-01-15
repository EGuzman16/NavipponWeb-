import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import MainLayout from "../../components/MainLayout";
import { signup } from "../../services/index/users";
import { userActions } from "../../store/reducers/userReducers";

const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userState = useSelector((state) => state.user);
  
  const { mutate, isLoading } = useMutation({
    mutationFn: ({ name, email, password }) => {
      return signup({ name, email, password });
    },
    onSuccess: (data) => {
      console.log("Signup successful, data:", data);  // Log the complete response
      if (data) {
        const { name, email, token } = data;  // Destructure data if it's valid
        dispatch(userActions.setUserInfo(name, email, token));
        localStorage.setItem("account", JSON.stringify({ name, email, token }));
      } else {
        console.error('Signup data is undefined');  // Log if data is undefined
      }
    },
    onError: (error) => {
      console.log("Error during signup:", error);  // Log the error
      toast.error(error.message);
    },
  });
  
  
  useEffect(() => {
    if (userState.userInfo) {
      navigate("/");
    }
  }, [navigate, userState.userInfo]);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const submitHandler = (data) => {
    const { name, email, password } = data;
    mutate({ name, email, password });
  };

  const password = watch("password");

  return (
    <MainLayout>
      <section className="flex justify-center items-center min-h-screen py-12">
            <div className="w-full max-w-lg p-12 bg-white">
                <h2 className="text-2xl font-bold mb-4 text-center">Registro</h2>
                <form className="space-y-4" onSubmit={handleSubmit(submitHandler)}>
                    <div className="flex flex-col mb-6 w-full">
                        <label htmlFor="name" className="block mb-1 text-[#5a7184] font-semibold">
                            Nombre*
                        </label>
                        <input
                            type="text"
                            id="name"
                            {...register("name", {
                                minLength: {
                                    value: 1,
                                    message: "El nombre debe tener al menos 1 caracter",
                                },
                                required: {
                                    value: true,
                                    message: "El nombre es requerido",
                                }
                            })}
                            placeholder="Ingresa tu nombre"
                            className={`w-full p-2 rounded-full bg-[#F2F2F2] border ${errors.name ? 'border-[#FA5564]' : 'border-gray-300'}`}
                        />
                        {errors.name?.message && (
                            <p className='text-[#FA5564] text-xs mt-1'>
                                {errors.name?.message}
                            </p>
                        )}
                    </div>
                    <div className="flex flex-col mb-6 w-full">
                        <label htmlFor="email" className="block mb-1 text-[#5a7184] font-semibold">
                            Email*
                        </label>
                        <input
                            type="email"
                            id="email"
                            {...register("email", {
                                pattern: {
                                    value:
                                        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                    message: "Ingresa un email válido",
                                },
                                required: {
                                    value: true,
                                    message: "El Email es requerido",
                                },
                            })}
                            placeholder="Ingresa tu email"
                            className={`w-full p-2 rounded-full bg-[#F2F2F2] border ${errors.email ? 'border-[#FA5564]' : 'border-gray-300'}`}
                        />
                        {errors.email?.message && (
                            <p className='text-[#FA5564] text-xs mt-1'>
                                {errors.email?.message}
                            </p>
                        )}
                    </div>
                    <div className="flex flex-col mb-6 w-full">
                        <label htmlFor="password" className="block mb-1 text-[#5a7184] font-semibold">
                            Contraseña*
                        </label>
                        <input
                            type="password"
                            id="password"
                            {...register("password", {
                                required: {
                                    value: true,
                                    message: "La contraseña es requerida",
                                },
                                minLength: {
                                    value: 6,
                                    message: "La contraseña debe tener al menos 6 caracteres",
                                },
                            })}
                            placeholder="Ingresa tu contraseña"
                            className={`w-full p-2 rounded-full bg-[#F2F2F2] border ${errors.password ? 'border-[#FA5564]' : 'border-gray-300'}`}
                        />
                        {errors.password?.message && (
                            <p className='text-[#FA5564] text-xs mt-1'>
                                {errors.password?.message}
                            </p>
                        )}
                    </div>
                    <div className="flex flex-col mb-6 w-full">
                        <label htmlFor="confirmPassword" className="block mb-1 text-[#5a7184] font-semibold">
                            Confirmar Contraseña*
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            {...register("confirmPassword", {
                                required: {
                                    value: true,
                                    message: "La confirmación de la contraseña es requerida",
                                },
                                validate: (value) => {
                                    if (value !== password) {
                                        return "La contraseña no coincide";
                                    }
                                },
                            })}
                            placeholder="Confirma tu contraseña"
                            className={`w-full p-2 rounded-full bg-[#F2F2F2] border ${errors.confirmPassword ? 'border-[#FA5564]' : 'border-gray-300'}`}
                        />
                        {errors.confirmPassword?.message && (
                            <p className='text-[#FA5564] text-xs mt-1'>
                                {errors.confirmPassword?.message}
                            </p>
                        )}
                    </div>
                    <button
                        type="submit"
                        disabled={!isValid || isLoading}
                        className="w-full p-2 bg-[#FA5564] text-white rounded-full mb-6 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        Registrarse
                    </button>
                        <div className="mt-4 text-center">
                        <span>¿Ya tienes cuenta? </span>
                        <Link to="/login" className="text-[#FA5564]">Iniciar Sesión</Link>
                    </div>
                </form>
            </div>
        </section>

    </MainLayout>
  );
};

export default RegisterPage;
