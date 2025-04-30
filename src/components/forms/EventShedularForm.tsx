"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { eventSchema, EventSchema } from "@/lib/formValidationSchemas";
import { createEvent, updateEvent } from "@/lib/actions";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const EventShedularForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: { classes: { id: number; name: string }[] };
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
  } = useForm<EventSchema>({
    resolver: zodResolver(eventSchema),
  });

  const [state, formAction] = useFormState(
    type === "create" ? createEvent : updateEvent,
    {
      success: false,
      error: false,
    }
  );

  const onSubmit = handleSubmit((formData) => {
    // Check if start and end times are the same
    if (new Date(formData.startTime).getTime() === new Date(formData.endTime).getTime()) {
      setError("endTime", {
        type: "manual",
        message: "End time cannot be same as start time",
      });
      return;
    }

    const submissionData = {
      title: formData.title,
      description: formData.description,
      startTime: new Date(formData.startTime),
      endTime: new Date(formData.endTime),
      classId: formData.classId ? parseInt(formData.classId) : null,
      ...(type === "update" && data?.id && { id: data.id }),
    };
    formAction(submissionData);
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(`Event has been ${type === "create" ? "created" : "updated"}!`);
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen]);

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create New Event" : "Update Event"}
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
          <label className="text-xs text-gray-500">Description</label>
          <textarea
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm"
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
          label="Start Time"
          name="startTime"
          type="datetime-local"
          defaultValue={data?.startTime ? new Date(data.startTime).toISOString().slice(0, 16) : ""}
          register={register}
          error={errors?.startTime}
        />

        <InputField
          label="End Time"
          name="endTime"
          type="datetime-local"
          defaultValue={data?.endTime ? new Date(data.endTime).toISOString().slice(0, 16) : ""}
          register={register}
          error={errors?.endTime}
        />

        <div className="flex flex-col gap-2">
          <label className="text-xs text-gray-500">Class (optional)</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm"
            {...register("classId")}
            defaultValue={data?.classId || ""}
          >
            <option value="">Select a class (or leave blank for general event)</option>
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

export default EventsShedularForm;
