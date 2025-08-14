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
import { ThemeToggle } from "@/components/theme-toggle";
import { PhoneInput } from "@/components/ui/phone-input";
// Import the logo using the correct path

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
      await sendOtpMutation.mutateAsync({ phone, role: role as any });
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
        {/* Hero Section */}
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                <svg width="40" height="40" viewBox="0 0 200 200" className="text-white">
                  <g transform="translate(100, 100)">
                    <rect x="-25" y="-15" width="50" height="30" rx="3" fill="currentColor" />
                    <rect x="-22" y="-12" width="44" height="24" rx="2" fill="white" />
                    <line x1="-15" y1="-8" x2="15" y2="-8" stroke="currentColor" strokeWidth="2" />
                    <line x1="-15" y1="-3" x2="15" y2="-3" stroke="currentColor" strokeWidth="2" />
                    <line x1="-15" y1="2" x2="10" y2="2" stroke="currentColor" strokeWidth="2" />
                    <circle cx="-35" cy="-25" r="4" fill="white" />
                    <circle cx="35" cy="-25" r="4" fill="white" />
                    <circle cx="-35" cy="25" r="4" fill="white" />
                    <circle cx="35" cy="25" r="4" fill="white" />
                  </g>
                </svg>
              </div>
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 dark:from-blue-400 dark:via-purple-400 dark:to-cyan-400 bg-clip-text text-transparent">
                  EduConnect
                </h1>
                <p className="text-lg font-medium text-gray-700 dark:text-gray-300">Smart Learning Management</p>
              </div>
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
              Comprehensive educational management platform for students, teachers, parents, and administrators
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Test Login Credentials:</h3>
              <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <p><strong>Admin:</strong> +918475354789 or +919876543210</p>
                <p><strong>Coordinator:</strong> +919231978777 or +919876543211</p>
                <p><strong>Teacher:</strong> +918888888888 or +919876543212</p>
                <p><strong>Student:</strong> +919999999999 or +919876543213</p>
                <p><strong>Parent:</strong> +917777777777 or +919876543214</p>
                <p className="mt-2 font-medium">Use any 6-digit OTP for verification</p>
              </div>
            </div>
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
                    <PhoneInput
                      value={phone}
                      onChange={setPhone}
                      placeholder="Enter your phone number"
                    />
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