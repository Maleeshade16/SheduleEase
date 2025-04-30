"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import CustomInput from "../CustomInput";
import { examSchema, ExamSchema } from "@/lib/validationSchemas";
import { createExam, updateExam } from "@/lib/apiActions";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect } from "react";
import { showNotification } from "../Notification";
import { useRouter } from "next/navigation";

interface ExamShedularForm {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any;
}

const ExamForm = ({ type, data, setOpen, relatedData }: ExamFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ExamSchema>({
    resolver: zodResolver(examSchema),
    defaultValues: data || {},
  });

  const [state, formAction] = useFormState(
    type === "create" ? createExam : updateExam,
    { success: false, error: null }
  );

  const onSubmit = handleSubmit((formData) => {
    formAction(formData);
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      showNotification(
        `Exam ${type === "create" ? "created" : "updated"} successfully`
      );
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen]);

  const { lessons } = relatedData || { lessons: [] };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <form onSubmit={onSubmit} className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {type === "create" ? "New Exam" : "Edit Exam"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomInput
            label="Exam Title"
            name="title"
            register={register}
            error={errors.title}
          />

          <CustomInput
            label="Start Date & Time"
            name="startTime"
            type="datetime-local"
            register={register}
            error={errors.startTime}
          />

          <CustomInput
            label="End Date & Time"
            name="endTime"
            type="datetime-local"
            register={register}
            error={errors.endTime}
          />

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lesson
            </label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md"
              {...register("lessonId")}
            >
              {lessons.map((lesson: { id: number; name: string }) => (
                <option value={lesson.id} key={lesson.id}>
                  {lesson.name}
                </option>
              ))}
            </select>
            {errors.lessonId && (
              <p className="mt-1 text-sm text-red-600">
                {errors.lessonId.message}
              </p>
            )}
          </div>
        </div>

        {data && (
          <input type="hidden" {...register("id")} value={data?.id} />
        )}

        {state.error && (
          <div className="text-red-600 text-sm">{state.error}</div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {type === "create" ? "Create" : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExamShedularForm;
