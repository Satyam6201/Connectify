import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { CameraIcon, LoaderIcon, MapPinIcon, ShuffleIcon, XIcon, UserCheckIcon } from "lucide-react";
import toast from "react-hot-toast";
import { updateProfile } from "../lib/api";
import { LANGUAGES } from "../constants";

const EditProfileModal = ({ isOpen, onClose, authUser }) => {
  const queryClient = useQueryClient();

  const [formState, setFormState] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "",
  });

  const { mutate: updateProfileMutation, isPending } = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      onClose();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update profile");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfileMutation(formState);
  };

  const handleRandomAvatar = () => {
    const randomSeed = Math.random().toString(36).substring(2, 10);
    const randomAvatar = `https://api.dicebear.com/9.x/adventurer/svg?seed=${randomSeed}`;
    setFormState((prev) => ({ ...prev, profilePic: randomAvatar }));
    toast.success("Generated new avatar preview!");
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-2xl bg-base-200 border border-base-300 rounded-3xl shadow-2xl overflow-hidden my-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-base-300">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10 text-primary">
                <UserCheckIcon className="size-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Edit Your Profile</h3>
                <p className="text-xs opacity-70">Update your language goals and personal details</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="btn btn-ghost btn-circle btn-sm"
              disabled={isPending}
            >
              <XIcon className="size-5" />
            </button>
          </div>

          {/* Body Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Avatar Preview & Shuffle */}
            <div className="flex flex-col sm:flex-row items-center gap-5 bg-base-100 p-4 rounded-2xl border border-base-300">
              <div className="relative">
                <div className="size-20 rounded-full bg-base-300 overflow-hidden border-2 border-primary shadow-lg">
                  {formState.profilePic ? (
                    <img
                      src={formState.profilePic}
                      alt="Profile Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <CameraIcon className="size-8 opacity-40" />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1 text-center sm:text-left">
                <p className="font-semibold text-sm">Profile Picture</p>
                <p className="text-xs opacity-60 mb-3">Roll a fresh avatar seed or keep your current one</p>
                <button
                  type="button"
                  onClick={handleRandomAvatar}
                  className="btn btn-sm btn-outline btn-primary rounded-xl"
                >
                  <ShuffleIcon className="size-3.5 mr-1" />
                  Generate New Avatar
                </button>
              </div>
            </div>

            {/* Full Name & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium text-xs">Full Name</span>
                </label>
                <input
                  type="text"
                  value={formState.fullName}
                  onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
                  className="input input-bordered w-full h-11 rounded-xl text-sm"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium text-xs">Location</span>
                </label>
                <div className="relative">
                  <MapPinIcon className="absolute top-1/2 -translate-y-1/2 left-3 size-4 opacity-50" />
                  <input
                    type="text"
                    value={formState.location}
                    onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                    className="input input-bordered w-full pl-9 h-11 rounded-xl text-sm"
                    placeholder="e.g. Tokyo, Japan"
                  />
                </div>
              </div>
            </div>

            {/* Native & Learning Languages */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium text-xs">Native Language</span>
                </label>
                <select
                  value={formState.nativeLanguage}
                  onChange={(e) => setFormState({ ...formState, nativeLanguage: e.target.value })}
                  className="select select-bordered w-full h-11 rounded-xl text-sm"
                  required
                >
                  <option value="">Select native language</option>
                  {LANGUAGES.map((lang) => (
                    <option key={`native-${lang}`} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium text-xs">Learning Language</span>
                </label>
                <select
                  value={formState.learningLanguage}
                  onChange={(e) => setFormState({ ...formState, learningLanguage: e.target.value })}
                  className="select select-bordered w-full h-11 rounded-xl text-sm"
                  required
                >
                  <option value="">Select learning language</option>
                  {LANGUAGES.map((lang) => (
                    <option key={`learning-${lang}`} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Bio */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-xs">Bio & Learning Goals</span>
              </label>
              <textarea
                value={formState.bio}
                onChange={(e) => setFormState({ ...formState, bio: e.target.value })}
                className="textarea textarea-bordered h-24 rounded-xl text-sm resize-none"
                placeholder="Share your interests, hobbies, or what you'd like to practice..."
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-ghost rounded-xl"
                disabled={isPending}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary rounded-xl px-6"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <LoaderIcon className="size-4 animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default EditProfileModal;
