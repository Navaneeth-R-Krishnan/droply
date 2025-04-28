/* eslint-disable */
"use client"
import { useState } from "react";
import {useForm} from "react-hook-form"
import { useRouter } from "next/navigation";
import {useSignUp} from "@clerk/nextjs"
import {z} from "zod";
import { Card, CardBody, CardHeader, CardFooter } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Divider } from "@heroui/divider";
// Custom Zod Schema 
import { signUpSchema } from "@/schemas/signUpSchema";
import {zodResolver} from "@hookform/resolvers/zod"
import {
    Mail,
    Lock,
    AlertCircle,
    CheckCircle,
    Eye,
    EyeOff,
  } from "lucide-react";

export default function SignUpForm() {
    const [verifying, setVerifying] = useState(false)
    const router = useRouter()
    const {isLoaded, signUp, setActive} = useSignUp()
    const [verificationCode, setVerificationCode] = useState("")
    const [verificationError, setVerificationError] = useState<string | null>(
        null
      );
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [authError, setAuthError] = useState<string | null>(null)
    const {register, handleSubmit, formState: {errors}} = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues:{
            email: "",
            password: "",
            passwordConfirmation: ""
        }

    })




    const onSubmit = async(data:z.infer<typeof signUpSchema>)=>{
        if (!isLoaded) return;
        setIsSubmitting(true)
        setAuthError(null)
        // setVerifying(true)

        try {
            await signUp.create({
                emailAddress: data.email,
                password: data.password
            })
       
        await signUp.prepareEmailAddressVerification({
            strategy: "email_code"
        })
        setVerifying(true)
    }
        catch (error) {
            if (error instanceof Error) {
                setAuthError(error.message)
            }
        }
        finally {
            setIsSubmitting(false)
        }

    };
    const handleVerificationSubmit = async (
        e: React.FormEvent<HTMLFormElement>
      ) => {
        e.preventDefault();
        if (!isLoaded || !signUp) return;
    
        setIsSubmitting(true);
        setVerificationError(null);
    
        try {
          const result = await signUp.attemptEmailAddressVerification({
            code: verificationCode,
          });
    
          if (result.status === "complete") {
            await setActive({ session: result.createdSessionId });
            router.push("/dashboard");
          } else {
            console.error("Verification incomplete:", result);
            setVerificationError(
              "Verification could not be completed. Please try again."
            );
          }
        } catch (error: any) {
          console.error("Verification error:", error);
          setVerificationError(
            error.errors?.[0]?.message ||
              "An error occurred during verification. Please try again."
          );
        } finally {
          setIsSubmitting(false);
        }
      };

    if (verifying){
        return (
            <Card className="w-full max-w-md border border-default-200 bg-default-50 shadow-xl">
              <CardHeader className="flex flex-col gap-1 items-center pb-2">
                <h1 className="text-2xl font-bold text-default-900">
                  Verify Your Email
                </h1>
                <p className="text-default-500 text-center">
                  We've sent a verification code to your email
                </p>
              </CardHeader>
              <Divider />

        <CardBody className="py-6">
          {verificationError && (
            <div className="bg-danger-50 text-danger-700 p-4 rounded-lg mb-6 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p>{verificationError}</p>
            </div>
          )}

          <form onSubmit={handleVerificationSubmit} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="verificationCode"
                className="text-sm font-medium text-default-900"
              >
                Verification Code
              </label>
              <Input
                id="verificationCode"
                type="text"
                placeholder="Enter the 6-digit code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="w-full"
                autoFocus
              />
            </div>

            <Button
              type="submit"
              color="primary"
              className="w-full"
              isLoading={isSubmitting}
            >
              {isSubmitting ? "Verifying..." : "Verify Email"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-default-500">
              Didn't receive a code?{" "}
              <button
                onClick={async () => {
                  if (signUp) {
                    await signUp.prepareEmailAddressVerification({
                      strategy: "email_code",
                    });
                  }
                }}
                className="text-primary hover:underline font-medium"
              >
                Resend code
              </button>
            </p>
          </div>
        </CardBody>
      </Card>
    );
  }
    }




