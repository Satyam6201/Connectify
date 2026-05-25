import { useState } from "react";
import useAuthUser from "../hooks/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  CameraIcon,
  LoaderIcon,
  MapPinIcon,
  ShipWheelIcon,
  ShuffleIcon,
} from "lucide-react";
import { completeOnboarding } from "../lib/api";
import { LANGUAGES } from "../constants";
import { motion } from "framer-motion";

const OnboardingPage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();

  const [formState, setFormState] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "",
  });

  const { mutate: onboardingMutation, isPending } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      toast.success("Profile Onboarded successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },

    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onboardingMutation(formState);
  };

  const handleRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

    setFormState({ ...formState, profilePic: randomAvatar });
    toast.success("Random profile picture generated!");
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-base-100 flex items-center justify-center px-4 py-10">

      <div className="absolute top-0 left-0 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-secondary/20 rounded-full blur-3xl animate-pulse" />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 card bg-base-200/80 backdrop-blur-xl w-full max-w-4xl shadow-2xl border border-base-300"
      >
        <div className="card-body p-5 sm:p-8 md:p-10">

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl sm:text-4xl font-black">
              Complete Your Profile
            </h1>

            <p className="opacity-70 mt-3 text-sm sm:text-base">
              Customize your profile and start connecting with people.
            </p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-8">

            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col items-center justify-center"
            >

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative"
              >
                <div className="size-32 sm:size-36 rounded-full bg-base-300 overflow-hidden border-4 border-primary shadow-2xl">
                  {formState.profilePic ? (
                    <img
                      src={formState.profilePic}
                      alt="Profile Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <CameraIcon className="size-14 text-base-content opacity-40" />
                    </div>
                  )}
                </div>

                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    repeat: Infinity,
                    duration: 15,
                    ease: "linear",
                  }}
                  className="absolute inset-0 rounded-full border-2 border-dashed border-primary/40"
                />
              </motion.div>

              <motion.button
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
                type="button"
                onClick={handleRandomAvatar}
                className="btn btn-accent mt-6 rounded-full px-6"
              >
                <ShuffleIcon className="size-4 mr-2" />
                Generate Random Avatar
              </motion.button>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="form-control"
              >
                <label className="label">
                  <span className="label-text font-medium">Full Name</span>
                </label>

                <input
                  type="text"
                  name="fullName"
                  value={formState.fullName}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      fullName: e.target.value,
                    })
                  }
                  className="input input-bordered w-full h-12 focus:scale-[1.02] transition-transform"
                  placeholder="Your full name"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="form-control"
              >
                <label className="label">
                  <span className="label-text font-medium">Location</span>
                </label>

                <div className="relative">
                  <MapPinIcon className="absolute top-1/2 -translate-y-1/2 left-3 size-5 opacity-60" />

                  <input
                    type="text"
                    name="location"
                    value={formState.location}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        location: e.target.value,
                      })
                    }
                    className="input input-bordered w-full pl-10 h-12 focus:scale-[1.02] transition-transform"
                    placeholder="City, Country"
                  />
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="form-control"
            >
              <label className="label">
                <span className="label-text font-medium">Bio</span>
              </label>

              <textarea
                name="bio"
                value={formState.bio}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    bio: e.target.value,
                  })
                }
                className="textarea textarea-bordered h-28 resize-none focus:scale-[1.01] transition-transform"
                placeholder="Tell others about yourself and your language learning goals"
              />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="form-control"
              >
                <label className="label">
                  <span className="label-text font-medium">
                    Native Language
                  </span>
                </label>

                <select
                  name="nativeLanguage"
                  value={formState.nativeLanguage}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      nativeLanguage: e.target.value,
                    })
                  }
                  className="select select-bordered h-12"
                >
                  <option value="">Select your native language</option>

                  {LANGUAGES.map((lang) => (
                    <option
                      value={lang.toLowerCase()}
                      key={`native-${lang}`}
                    >
                      {lang}
                    </option>
                  ))}
                </select>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="form-control"
              >
                <label className="label">
                  <span className="label-text font-medium">
                    Learning Language
                  </span>
                </label>

                <select
                  name="learningLanguage"
                  value={formState.learningLanguage}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      learningLanguage: e.target.value,
                    })
                  }
                  className="select select-bordered h-12"
                >
                  <option value="">
                    Select language you're learning
                  </option>

                  {LANGUAGES.map((lang) => (
                    <option
                      value={lang.toLowerCase()}
                      key={`learning-${lang}`}
                    >
                      {lang}
                    </option>
                  ))}
                </select>
              </motion.div>
            </div>

            <motion.button
              whileHover={{
                scale: 1.02,
                boxShadow: "0px 0px 30px rgba(0,255,255,0.3)",
              }}
              whileTap={{ scale: 0.97 }}
              disabled={isPending}
              type="submit"
              className="btn btn-primary w-full h-14 text-base rounded-2xl"
            >
              {!isPending ? (
                <>
                  <ShipWheelIcon className="size-5 mr-2" />
                  Complete Onboarding
                </>
              ) : (
                <>
                  <LoaderIcon className="animate-spin size-5 mr-2" />
                  Onboarding...
                </>
              )}
            </motion.button>

          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default OnboardingPage;