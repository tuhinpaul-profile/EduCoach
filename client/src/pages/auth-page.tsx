import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Phone, Shield, Users, GraduationCap, Heart, Settings } from "lucide-react";
import { userRoles } from "@shared/schema";

const roleConfig = {
  admin: {
    icon: Shield,
    title: "Admin Login",
    description: "Access administrative controls and system management",
    color: "text-red-600",
    bgColor: "bg-red-50"
  },
  coordinator: {
    icon: Settings,
    title: "Coordinator Login", 
    description: "Manage batches, students, and daily operations",
    color: "text-blue-600",
    bgColor: "bg-blue-50"
  },
  teacher: {
    icon: GraduationCap,
    title: "Teacher Login",
    description: "Access teaching materials and student progress",
    color: "text-green-600",
    bgColor: "bg-green-50"
  },
  student: {
    icon: Users,
    title: "Student Login",
    description: "View assignments, results, and schedules",
    color: "text-purple-600",
    bgColor: "bg-purple-50"
  },
  parent: {
    icon: Heart,
    title: "Parent Login",
    description: "Monitor child's progress and receive updates",
    color: "text-pink-600",
    bgColor: "bg-pink-50"
  }
};

export default function AuthPage() {
  const { user, sendOtpMutation, verifyOtpMutation } = useAuth();
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<string>("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");

  // Redirect if already logged in
  if (user) {
    window.location.href = "/";
    return null;
  }

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !role) return;

    try {
      await sendOtpMutation.mutateAsync({ phone, role });
      setStep("otp");
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || !phone) return;

    try {
      await verifyOtpMutation.mutateAsync({ phone, otp });
      // Redirect will happen automatically when user state updates
    } catch (error) {
      // Error handled by mutation
    }
  };

  const selectedRoleConfig = role ? roleConfig[role as keyof typeof roleConfig] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
        {/* Hero Section */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              EduManage Pro
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Comprehensive educational management platform for students, teachers, parents, and administrators
            </p>
          </div>

          <div className="grid gap-4">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Platform Features</h2>
            
            <div className="grid gap-3">
              {Object.entries(roleConfig).map(([roleKey, config]) => {
                const Icon = config.icon;
                return (
                  <div key={roleKey} className={`flex items-center gap-3 p-3 rounded-lg ${config.bgColor}`}>
                    <Icon className={`w-5 h-5 ${config.color}`} />
                    <div>
                      <div className="font-medium text-gray-800">{config.title}</div>
                      <div className="text-sm text-gray-600">{config.description}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Auth Form */}
        <div className="w-full max-w-md mx-auto">
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">
                {selectedRoleConfig ? selectedRoleConfig.title : "Login to Continue"}
              </CardTitle>
              <CardDescription>
                {selectedRoleConfig 
                  ? selectedRoleConfig.description 
                  : "Select your role and enter your phone number to get started"
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {step === "phone" ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="role">Select Role</Label>
                    <Select value={role} onValueChange={setRole} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose your role" />
                      </SelectTrigger>
                      <SelectContent>
                        {userRoles.map((roleOption) => {
                          const config = roleConfig[roleOption as keyof typeof roleConfig];
                          const Icon = config.icon;
                          return (
                            <SelectItem key={roleOption} value={roleOption}>
                              <div className="flex items-center gap-2">
                                <Icon className={`w-4 h-4 ${config.color}`} />
                                <span className="capitalize">{roleOption}</span>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={!phone || !role || sendOtpMutation.isPending}
                  >
                    {sendOtpMutation.isPending ? "Sending OTP..." : "Send OTP"}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="otp">Verification Code</Label>
                    <Input
                      id="otp"
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      maxLength={6}
                      required
                    />
                    <p className="text-sm text-gray-500">
                      OTP sent to {phone}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setStep("phone")}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button 
                      type="submit" 
                      className="flex-1"
                      disabled={!otp || verifyOtpMutation.isPending}
                    >
                      {verifyOtpMutation.isPending ? "Verifying..." : "Verify & Login"}
                    </Button>
                  </div>
                </form>
              )}

              <div className="text-center text-sm text-gray-500 mt-6">
                <p>Secure OTP-based authentication</p>
                <p>Contact administrator if you need account access</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}