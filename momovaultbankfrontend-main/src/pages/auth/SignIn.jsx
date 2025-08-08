import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CommonForm from "@/components/common-form/form-controls";
import { signInFormControls } from "@/components/common-form/index";



import { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "@/context/auth-context";
// ... other imports

export default function SignIn() {
  const { signInFormData, setSignInFormData, handleLoginUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  const location = useLocation();

  // Where to redirect after login? Use location.state.from or fallback to "/checkout"
  const from = location.state?.from?.pathname || "/checkout";

  const isValid = () =>
    signInFormData?.userEmail !== "" && signInFormData?.password !== "";

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timeout);
  }, []);

  // Wrap your login handler to handle navigation after successful login
const onSubmit = async (e) => {
  e.preventDefault();

  // Pass the redirect path from location.state.from.pathname or fallback
  const success = await handleLoginUser(e, from);

  if (success) {
    // No need to navigate here — navigation is done inside handleLoginUser
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
      {/* ... your existing header */}
      <div className="flex items-center justify-center flex-1 px-4">
        <Card className="p-6 space-y-4 bg-white rounded-2xl shadow-xl w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold text-orange-500">
              Login
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <CommonForm
              formControls={signInFormControls}
              buttonText={"Login"}
              formData={signInFormData}
              setFormData={setSignInFormData}
              isButtonDisabled={!isValid()}
              handleSubmit={onSubmit}  // <-- use wrapped handler here
              inputClassName="bg-white text-black border border-orange-300 focus:border-orange-500 rounded-md"
              buttonClassName="bg-orange-500 hover:bg-orange-600 text-white w-full py-2 rounded-md transition-colors"
            />
            <div className="text-center text-sm mt-2 text-black">
              Not a member?{" "}
              <Link to="/signup" className="hover:text-orange-500 transition-colors">
                Signup now
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
