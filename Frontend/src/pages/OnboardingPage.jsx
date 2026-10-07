import { useState } from "react";
import useAuthUser from "../hooks/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { FiCamera, FiGlobe, FiLoader, FiMapPin, FiRefreshCw } from "react-icons/fi";
import { completeOnboarding } from "../lib/api";
import { LANGUAGES } from "../constants";

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
      toast.success("Profile setup completed");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to complete setup");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onboardingMutation(formState);
  };

  const handleRandomAvatar = () => {
    const randomSeed = Math.random().toString(36).substring(2, 10);
    const randomAvatar = `https://api.dicebear.com/9.x/adventurer/svg?seed=${randomSeed}`;
    setFormState({ ...formState, profilePic: randomAvatar });
    toast.success("Random avatar generated");
  };

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4 sm:p-6 lg:p-10">
      <div className="card bg-base-200/90 border border-base-300 w-full max-w-3xl shadow-xl rounded-2xl">
        <div className="card-body p-6 sm:p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold">Complete Your Profile</h1>
            <p className="opacity-70 mt-1 text-xs sm:text-sm">
              Set up your language preferences to find the best partners.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center justify-center">
              <div className="size-28 sm:size-32 rounded-full bg-base-300 overflow-hidden border-2 border-primary shadow-lg relative">
                {formState.profilePic ? (
                  <img
                    src={formState.profilePic}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <FiCamera className="size-10 text-base-content opacity-40" />
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleRandomAvatar}
                className="btn btn-outline btn-primary btn-xs mt-3 rounded-lg gap-1.5"
              >
                <FiRefreshCw className="size-3" />
                Randomize Avatar
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text font-medium text-xs">Full Name</span>
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
                  className="input input-bordered w-full h-11 rounded-xl text-sm"
                  placeholder="Your full name"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text font-medium text-xs">Location</span>
                </label>
                <div className="relative">
                  <FiMapPin className="absolute top-1/2 -translate-y-1/2 left-3 size-4 opacity-50" />
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
                    className="input input-bordered w-full pl-9 h-11 rounded-xl text-sm"
                    placeholder="City, Country"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-medium text-xs">Bio & Goals</span>
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
                className="textarea textarea-bordered h-24 rounded-xl text-sm resize-none"
                placeholder="Describe your language learning goals and interests..."
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text font-medium text-xs">Native Language</span>
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
                  className="select select-bordered h-11 rounded-xl text-sm"
                  required
                >
                  <option value="">Select native language</option>
                  {LANGUAGES.map((lang) => (
                    <option value={lang.toLowerCase()} key={`native-${lang}`}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text font-medium text-xs">Learning Language</span>
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
                  className="select select-bordered h-11 rounded-xl text-sm"
                  required
                >
                  <option value="">Select target language</option>
                  {LANGUAGES.map((lang) => (
                    <option value={lang.toLowerCase()} key={`learning-${lang}`}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              disabled={isPending}
              type="submit"
              className="btn btn-primary w-full h-12 text-sm font-semibold rounded-xl"
            >
              {!isPending ? (
                <>
                  <FiGlobe className="size-4 mr-1.5" />
                  Save and Continue
                </>
              ) : (
                <>
                  <FiLoader className="animate-spin size-4 mr-1.5" />
                  Saving...
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;