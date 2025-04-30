"use client";

import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { announcementSchema, AnnoucementSchema } from "@/lib/formValidationSchemas";
import { createAnnouncement, updateAnnouncement } from "@/lib/actions";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const AnnouncementForm = ({
  type,
  data,
  setOpen,
  relatedData,
  existingAnnouncements = [],
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: { classes: { id: number; name: string }[] };
  existingAnnouncements?: Array<{ date: Date }>;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
  } = useForm<AnnoucementSchema>({
    resolver: zodResolver(announcementSchema),
  });

  const [state, formAction] = useFormState(
    type === "create" ? createAnnouncement : updateAnnouncement,
    {
      success: false,
      error: false,
    }
  );

  const onSubmit = handleSubmit((formData) => {
    const announcementDate = new Date(formData.date);
    const isDuplicate = existingAnnouncements.some(announcement => 
      announcement.date.getTime() === announcementDate.getTime()
    );

    if (isDuplicate && type === "create") {
      setError("date", {
        type: "manual",
        message: "An announcement already exists at this date/time",
      });
      return;
    }

    const submissionData = {
      title: formData.title,
      description: formData.description,
      date: new Date(formData.date),
      classId: formData.classId ? parseInt(formData.classId) : null,
      ...(type === "update" && data?.id && { id: data.id }),
    };
    formAction(submissionData);
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(`Announcement has been ${type === "create" ? "created" : "updated"}!`);
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen]);

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create New Announcement" : "Update Announcement"}
      </h1>

      <div className="flex flex-col gap-4">
        <InputField
          label="Title (min 3 words)"
          name="title"
          defaultValue={data?.title}
          register={register}
          error={errors?.title}
        />
        
        <div className="flex flex-col gap-2">
          <label className="text-xs text-gray-500">Description (min 12 characters)</label>
          <textarea
            className={`ring-[1.5px] ${errors.description ? 'ring-red-400' : 'ring-gray-300'} p-2 rounded-md text-sm`}
            {...register("description")}
            defaultValue={data?.description}
            rows={4}
          />
          {errors.description?.message && (
            <p className="text-xs text-red-400">
              {errors.description.message.toString()}
            </p>
          )}
        </div>

        <InputField
          label="Date"
          name="date"
          type="datetime-local"
          defaultValue={data?.date ? new Date(data.date).toISOString().slice(0, 16) : ""}
          register={register}
          error={errors?.date}
        />

        <div className="flex flex-col gap-2">
          <label className="text-xs text-gray-500">Class (optional)</label>
          <select
            className={`ring-[1.5px] ${errors.classId ? 'ring-red-400' : 'ring-gray-300'} p-2 rounded-md text-sm`}
            {...register("classId")}
            defaultValue={data?.classId || ""}
          >
            <option value="">Select a class (or leave blank for general announcement)</option>
            {relatedData?.classes.map((classItem) => (
              <option
                value={classItem.id}
                key={classItem.id}
              >
                {classItem.name}
              </option>
            ))}
          </select>
          {errors.classId?.message && (
            <p className="text-xs text-red-400">
              {errors.classId.message.toString()}
            </p>
          )}
        </div>

        {type === "update" && data?.id && (
          <input type="hidden" {...register("id", { valueAsNumber: true })} value={data.id} />
        )}
      </div>

      {state.error && (
        <span className="text-red-500">Something went wrong!</span>
      )}
      
      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default AnnouncementForm;
