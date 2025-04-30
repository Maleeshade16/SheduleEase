"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import CustomInput from "../CustomInput";
import { classSchema, ClassSchema } from "@/lib/validationSchemas";
import { createClass, updateClass } from "@/lib/apiActions";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect } from "react";
import { showNotification } from "../Notification";
import { useRouter } from "next/navigation";

interface ClassFormProps {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any;
}

const ClassForm = ({ type, data, setOpen, relatedData }: ClassFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClassSchema>({
    resolver: zodResolver(classSchema),
    defaultValues: data || {},
  });

  const [state, formAction] = useFormState(
    type === "create" ? createClass : updateClass,
    { success: false, error: null }
  );

  const onSubmit = handleSubmit((formData) => {
    formAction(formData);
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      showNotification(
        `Class ${type === "create" ? "created" : "updated"} successfully`
      );
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen]);

  const { teachers, grades } = relatedData || { teachers: [], grades: [] };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <form onSubmit={onSubmit} className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {type === "create" ? "New Class" : "Edit Class"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomInput
            label="Class Name"
            name="name"
            register={register}
            error={errors.name}
          />

          <CustomInput
            label="Capacity"
            name="capacity"
            type="number"
            register={register}
            error={errors.capacity}
          />

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Supervisor
            </label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md"
              {...register("supervisorId")}
            >
              {teachers.map(
                (teacher: { id: string; name: string; surname: string }) => (
                  <option value={teacher.id} key={teacher.id}>
                    {teacher.name} {teacher.surname}
                  </option>
                )
              )}
            </select>
            {errors.supervisorId && (
              <p className="mt-1 text-sm text-red-600">
                {errors.supervisorId.message}
              </p>
            )}
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Grade Level
            </label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md"
              {...register("gradeId")}
            >
              {grades.map((grade: { id: number; level: number }) => (
                <option value={grade.id} key={grade.id}>
                  Grade {grade.level}
                </option>
              ))}
            </select>
            {errors.gradeId && (
              <p className="mt-1 text-sm text-red-600">
                {errors.gradeId.message}
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

export default ClassForm;
