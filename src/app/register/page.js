"use client"
import { useState } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { auth } from '../../../firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import axios from 'axios';



const RegisterPage = () => {

  const router = useRouter();


  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    verbalScore: '',
    quantScore: '',
    awaScore: '',
    gpa: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.gpa) {
        newErrors.gpa = 'Required';
      } else {
        const score = parseInt(formData.gpa);
        if (isNaN(score) || score < 0.0 || score > 4.0) {
          newErrors.gpa = '0.0-4.0';
        }
      }

    if (!formData.verbalScore) {
        newErrors.verbalScore = 'Required';
      } else {
        const score = parseInt(formData.verbalScore);
        if (isNaN(score) || score < 130 || score > 170) {
          newErrors.verbalScore = '130-170';
        }
      }
  
      if (!formData.quantScore) {
        newErrors.quantScore = 'Required';
      } else {
        const score = parseInt(formData.quantScore);
        if (isNaN(score) || score < 130 || score > 170) {
          newErrors.quantScore = '130-170';
        }
      }
  

      if (!formData.awaScore) {
        newErrors.awaScore = 'Required';
      } else {
        const score = parseFloat(formData.awaScore);
        if (isNaN(score) || score < 0 || score > 6 || !Number.isInteger(score * 2)) {
          newErrors.awaScore = '0-6, 0.5 steps';
        }
      }
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      createUserWithEmailAndPassword(auth, formData.email, formData.password)
        .then((userCredential) => {
          // Signed up 
          const user = userCredential.user;
          const newUser = {
            _id: user.uid,
            full_name: formData.fullName,
            email: formData.email,
            gpa: parseFloat(formData.gpa),
            password: formData.password,
            verbal_score: parseInt(formData.verbalScore),
            quant_score: parseInt(formData.quantScore),
            awa_score: parseFloat(formData.awaScore)
          }
          axios.post('http://127.0.0.1:5000/api/users', newUser, {
            headers: {
              'Content-Type': 'application/json'
            }
          })
          .then((response) => {
            console.log("Registered user: ");
            console.log(response);
            router.push("/login");

          })
    
          setSubmitSuccess(true);
          setErrors({});
        })
        

      console.log("User id:", userCredential?.user?.id);

      

      

    } catch (error) {
      let errorMessage = 'Registration failed. Please try again.';
      
      // Handle specific Firebase errors
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'This email is already registered.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address.';
          break;
        case 'auth/operation-not-allowed':
          errorMessage = 'Email/password registration is not enabled.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Please choose a stronger password.';
          break;
      }
      
      setErrors({ submit: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleLoginClick = (e) => {
    e.preventDefault();
    router.push("/login");
  }

  return (
    <div>
      <Header displaySearch={false} />

      <div className="font-nunito min-h-screen flex justify-center items-center px-[10px] bg-[url(/geometric-background.svg)] bg-contain bg-center">
        <div className="w-[100%] lg:w-[50%] justify-center items-center">
            <div className="w-[100%] max-w-md mx-auto bg-white rounded-xl shadow-2xl overflow-hidden mt-[100px]">
            <div className="px-6 py-8">
            <h2 className="text-center text-3xl font-bold text-gray-900 mb-8">
                create your account
            </h2>
            
            {submitSuccess ? (
                <div className="rounded-lg bg-green-50 p-4">
                <div className="flex">
                    <div className="flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    </div>
                    <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">
                        registration successful!
                    </h3>
                    <div className="mt-2 text-sm text-green-700">
                        your account has been created successfully. Redirecting...
                    </div>
                    </div>
                </div>
                </div>
            ) : (
                <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                    full name
                    </label>
                    <div className="mt-1">
                    <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        required
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={formData.fullName}
                        onChange={handleChange}
                    />
                    {errors.fullName && (
                        <p className="mt-2 text-sm text-red-600">
                        {errors.fullName}
                        </p>
                    )}
                    </div>
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    email address
                    </label>
                    <div className="mt-1">
                    <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    {errors.email && (
                        <p className="mt-2 text-sm text-red-600">
                        {errors.email}
                        </p>
                    )}
                    </div>
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    password
                    </label>
                    <div className="mt-1">
                    <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    {errors.password && (
                        <p className="mt-2 text-sm text-red-600">
                        {errors.password}
                        </p>
                    )}
                    </div>
                </div>

                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    confirm password
                    </label>
                    <div className="mt-1">
                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        required
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                    />
                    {errors.confirmPassword && (
                        <p className="mt-2 text-sm text-red-600">
                        {errors.confirmPassword}
                        </p>
                    )}
                    </div>
                </div>
                <div>
                    <label htmlFor="gpa" className="block text-sm font-medium text-gray-700">
                    GPA
                    </label>
                    <div className="mt-1">
                    <input
                        id="gpa"
                        name="gpa"
                        type="number"
                        min = "0.0"
                        max= "4.0"
                        required
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={formData.gpa}
                        onChange={handleChange}
                    />
                    {errors.gpa && (
                        <p className="mt-2 text-sm text-red-600">
                        {errors.gpa}
                        </p>
                    )}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                    GRE scores
                    </label>
                    <div className="grid grid-cols-3 gap-4">
                    <div>
                        <input
                        id="verbalScore"
                        name="verbalScore"
                        type="number"
                        required
                        placeholder="Verbal"
                        min="130"
                        max="170"
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={formData.verbalScore}
                        onChange={handleChange}
                        />
                        {errors.verbalScore && (
                        <p className="mt-1 text-xs text-red-600">
                            {errors.verbalScore}
                        </p>
                        )}
                    </div>
                    
                    <div>
                        <input
                        id="quantScore"
                        name="quantScore"
                        type="number"
                        required
                        placeholder="Quant"
                        min="130"
                        max="170"
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={formData.quantScore}
                        onChange={handleChange}
                        />
                        {errors.quantScore && (
                        <p className="mt-1 text-xs text-red-600">
                            {errors.quantScore}
                        </p>
                        )}
                    </div>
                    
                    <div>
                        <input
                        id="awaScore"
                        name="awaScore"
                        type="number"
                        required
                        placeholder="AWA"
                        min="0"
                        max="6"
                        step="0.5"
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={formData.awaScore}
                        onChange={handleChange}
                        />
                        {errors.awaScore && (
                        <p className="mt-1 text-xs text-red-600">
                            {errors.awaScore}
                        </p>
                        )}
                    </div>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                    verbal & quant: 130-170 | AWA: 0-6 (in 0.5 steps)
                    </p>
                </div>

                {errors.submit && (
                    <div className="rounded-lg bg-red-50 p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                        <AlertCircle className="h-5 w-5 text-red-400" />
                        </div>
                        <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">
                            {errors.submit}
                        </h3>
                        </div>
                    </div>
                    </div>
                )}
                </form>
            )}
            </div>

            {!submitSuccess && (
              <div className="bg-white px-6 py-4 pb-[30px] flex flex-col justify-center items-center gap-[20px]">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  onClick={handleSubmit}
                  className="w-[90%] mx-auto bg-black text-white py-[10px] px-[50px]  rounded-[10px] font-[700] border-[1px] border-black hover:bg-[#fafafa] hover:text-black hover:border-[1px] hover:border-black transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Creating account...' : 'Create account'}
                </button>
                <div onClick={handleLoginClick} className='hover:text-gray-500 transition-all duration-300 cursor-pointer'>already registered? login</div>
              </div>
            )}
            </div>
        </div>
        {/* <div className="w-1/2 h-screen bg-cover bg-center flex items-center justify-center" >
            <Image src={registerimage} 
                    alt="My Image"
                    width={750} 
                    height={1050}
                />
        </div> */}
        
    </div>
    </div>
    
  );
};

export default RegisterPage;