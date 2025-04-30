"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import CustomInput from "../CustomInput";
import { subjectSchema, SubjectSchema } from "@/lib/validationSchemas";
import { createSubject, updateSubject } from "@/lib/apiActions";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect } from "react";
import { showNotification } from "../Notification";
import { useRouter } from "next/navigation";

interface SubjectFormProps {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any;
}

const SubjectShedularForm = ({ type, data, setOpen, relatedData }: SubjectFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SubjectSchema>({
    resolver: zodResolver(subjectSchema),
    defaultValues: data || {},
  });

  const [state, formAction] = useFormState(
    type === "create" ? createSubject : updateSubject,
    { success: false, error: null }
  );

  const onSubmit = handleSubmit((formData) => {
    formAction(formData);
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      showNotification(
        `Subject ${type === "create" ? "created" : "updated"} successfully`
      );
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen]);

  const { teachers } = relatedData || { teachers: [] };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <form onSubmit={onSubmit} className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {type === "create" ? "New Subject" : "Edit Subject"}
        </h2>

        <div className="grid grid-cols-1 gap-4">
          <CustomInput
            label="Subject Name"
            name="name"
            register={register}
            error={errors.name}
            placeholder="Enter subject name"
          />

          {data && (
            <input type="hidden" {...register("id")} value={data?.id} />
          )}

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teachers
            </label>
            <select
              multiple
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              {...register("teachers")}
            >
              {teachers.map((teacher: { id: string; name: string }) => (
                <option value={teacher.id} key={teacher.id}>
                  {teacher.name}
                </option>
              ))}
            </select>
            {errors.teachers && (
              <p className="mt-1 text-sm text-red-600">
                {errors.teachers.message}
              </p>
            )}
          </div>
        </div>

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

export default SubjectShedularForm;
