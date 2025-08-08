import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CommonForm from "@/components/common-form/form-controls";
import { signUpFormControls } from "@/components/common-form/index";
import { AuthContext } from "@/context/auth-context";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function SignUp() {
  const { signUpFormData, setSignUpFormData, handleRegisterUser } =
    useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  // Redirect destination after signup (default /checkout)
  const from = location.state?.from?.pathname || "/checkout";

  const isValid = () =>
    signUpFormData?.userName !== "" &&
    signUpFormData?.userEmail !== "" &&
    signUpFormData?.phoneNumber !== "" &&
    signUpFormData?.password !== "";

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timeout);
  }, []);

  // Wrap handleRegisterUser to pass redirect path and navigate after success
  const onSubmit = async (e) => {
    e.preventDefault();
    const success = await handleRegisterUser(e, from);
    if (success) {
      navigate(from, { replace: true });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-orange-500 to-orange-400">
      <header className="px-4 lg:px-6 h-14 flex items-center bg-white shadow">
        <Link
          to="/home"
          className="flex items-center hover:text-orange-500 transition-colors"
        >
          <img
            src="/momobank.png"
            alt="Logo"
            className="h-12 w-auto mr-2"
          />
          <span className="font-extrabold md:text-xl text-lg text-orange-500">
            Mo Pocket
          </span>
        </Link>
      </header>

      <div className="flex items-center justify-center flex-1 px-4">
        <Card className="p-6 space-y-4 bg-white rounded-2xl shadow-xl w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold text-orange-500">
              Create Account
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <CommonForm
              formControls={signUpFormControls}
              buttonText={"Signup"}
              formData={signUpFormData}
              setFormData={setSignUpFormData}
              isButtonDisabled={!isValid()}
              handleSubmit={onSubmit}  
              inputClassName="bg-white text-black border border-orange-300 focus:border-orange-500 rounded-md"
              buttonClassName="bg-orange-500 hover:bg-orange-600 text-white w-full py-2 rounded-md transition-colors"
            />
            <div className="text-center text-sm mt-2 text-black">
              Already have an account?{" "}
              <Link
                to="/signin"
                className="hover:text-orange-500 transition-colors"
              >
                Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
