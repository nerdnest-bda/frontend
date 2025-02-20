"use client"
import { useState } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { auth } from '../../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';

const SignIn = () => {

  const router = useRouter();

  const handleRegisterClick = (e) => {
    e.preventDefault();
    router.push("/register");
  }
  

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      setSubmitSuccess(true);
      setErrors({});
      // setTimeout(() => {
      //   // Redirect to home page or dashboard after successful sign-in
   
      // }, 2000);
      router.push("/");
    } catch (error) {
      let errorMessage = 'Sign-in failed. Please try again.';

      // Handle specific Firebase errors
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No user found with this email.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address.';
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

  return (
    <div>
      <Header displaySearch={false} />
      <div className="font-nunito min-h-screen bg-gray-50 flex justify-center items-center px-[200px] sm:px-6 lg:px-8 bg-[url(/geometric-background.svg)] bg-contain bg-center">
      <div className="w-1/2 flex-1 justify-center items-center">
        <div className="max-w-md mx-auto w-full bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="px-6 py-8">
            <h2 className="text-center text-3xl font-bold text-gray-900 mb-8">
              sign in to your account
            </h2>

            {submitSuccess ? (
              <div className="rounded-lg bg-green-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">
                      sign-in successful!
                    </h3>
                    <div className="mt-2 text-sm text-green-700">
                      redirecting...
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
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

                <div className="bg-white-500 px-6 py-4 border-t border-gray-100 flex flex-col items-center justify-center gap-[20px]">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    onClick={handleSubmit}
                    className="w-[90%] mx-auto bg-black text-white py-[10px] px-[50px] rounded-[10px] font-[700] border-[1px] border-black hover:bg-[#fafafa] hover:text-black hover:border-[1px] hover:border-black transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Signing in...' : 'Sign in'}
                  </button>
                  <div onClick={handleRegisterClick} className='hover:text-gray-500 transition-all duration-300 cursor-pointer'>not registered? register</div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>

    </div>
      );
};

export default SignIn;
