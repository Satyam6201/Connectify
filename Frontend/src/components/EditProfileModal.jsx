import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FiCamera, FiLoader, FiMapPin, FiRefreshCw, FiX, FiUserCheck } from "react-icons/fi";
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
      toast.success("Profile updated successfully");
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
    toast.success("Generated new avatar");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-base-200 border border-base-300 rounded-2xl shadow-2xl overflow-hidden my-6">
        <div className="flex items-center justify-between p-5 border-b border-base-300">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <FiUserCheck className="size-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Edit Profile</h3>
              <p className="text-xs opacity-60">Update your language goals and personal details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-circle btn-sm"
            disabled={isPending}
          >
            <FiX className="size-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-base-100 p-3.5 rounded-xl border border-base-300">
            <div className="size-16 rounded-full bg-base-300 overflow-hidden border-2 border-primary shadow-md">
              {formState.profilePic ? (
                <img
                  src={formState.profilePic}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <FiCamera className="size-6 opacity-40" />
                </div>
              )}
            </div>

            <div className="flex-1 text-center sm:text-left">
              <p className="font-semibold text-xs">Profile Avatar</p>
              <p className="text-[11px] opacity-60 mb-2">Generate a random avatar style</p>
              <button
                type="button"
                onClick={handleRandomAvatar}
                className="btn btn-xs btn-outline btn-primary rounded-lg gap-1.5"
              >
                <FiRefreshCw className="size-3" />
                Generate New Avatar
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-medium text-xs">Full Name</span>
              </label>
              <input
                type="text"
                value={formState.fullName}
                onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
                className="input input-bordered w-full h-10 rounded-xl text-xs"
                required
              />
            </div>

            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-medium text-xs">Location</span>
              </label>
              <div className="relative">
                <FiMapPin className="absolute top-1/2 -translate-y-1/2 left-3 size-3.5 opacity-50" />
                <input
                  type="text"
                  value={formState.location}
                  onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                  className="input input-bordered w-full pl-9 h-10 rounded-xl text-xs"
                  placeholder="e.g. Tokyo, Japan"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-medium text-xs">Native Language</span>
              </label>
              <select
                value={formState.nativeLanguage}
                onChange={(e) => setFormState({ ...formState, nativeLanguage: e.target.value })}
                className="select select-bordered w-full h-10 min-h-0 rounded-xl text-xs"
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
              <label className="label py-1">
                <span className="label-text font-medium text-xs">Learning Language</span>
              </label>
              <select
                value={formState.learningLanguage}
                onChange={(e) => setFormState({ ...formState, learningLanguage: e.target.value })}
                className="select select-bordered w-full h-10 min-h-0 rounded-xl text-xs"
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

          <div className="form-control">
            <label className="label py-1">
              <span className="label-text font-medium text-xs">Bio & Learning Goals</span>
            </label>
            <textarea
              value={formState.bio}
              onChange={(e) => setFormState({ ...formState, bio: e.target.value })}
              className="textarea textarea-bordered h-20 rounded-xl text-xs resize-none"
              placeholder="Share your interests and what you want to practice..."
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-base-300">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost btn-sm rounded-xl"
              disabled={isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-sm rounded-xl px-5"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <FiLoader className="size-3.5 animate-spin mr-1.5" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
