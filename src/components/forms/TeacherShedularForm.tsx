"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import CustomInput from "../CustomInput";
import { teacherSchema, TeacherSchema } from "@/lib/validationSchemas";
import { createTeacher, updateTeacher } from "@/lib/apiActions";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { showNotification } from "../Notification";
import { useRouter } from "next/navigation";
import ImageUpload from "../ImageUpload";

interface TeacherFormProps {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any;
}

const TeacherShedularForm = ({ type, data, setOpen, relatedData }: TeacherFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TeacherSchema>({
    resolver: zodResolver(teacherSchema),
    defaultValues: data || {},
  });

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [state, formAction] = useFormState(
    type === "create" ? createTeacher : updateTeacher,
    { success: false, error: null }
  );

  const onSubmit = handleSubmit((formData) => {
    formAction({ ...formData, img: imageUrl });
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      showNotification(
        `Teacher ${type === "create" ? "created" : "updated"} successfully`
      );
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen]);

  const { subjects } = relatedData || { subjects: [] };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <form onSubmit={onSubmit} className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {type === "create" ? "New Teacher" : "Edit Teacher"}
        </h2>

        <section className="space-y-4">
          <h3 className="text-lg font-medium text-gray-700">
            Account Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomInput
              label="Username"
              name="username"
              register={register}
              error={errors.username}
            />
            <CustomInput
              label="Email"
              name="email"
              type="email"
              register={register}
              error={errors.email}
            />
            <CustomInput
              label="Password"
              name="password"
              type="password"
              register={register}
              error={errors.password}
            />
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-lg font-medium text-gray-700">
            Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomInput
              label="First Name"
              name="name"
              register={register}
              error={errors.name}
            />
            <CustomInput
              label="Last Name"
              name="surname"
              register={register}
              error={errors.surname}
            />
            <CustomInput
              label="Phone"
              name="phone"
              register={register}
              error={errors.phone}
            />
            <CustomInput
              label="Address"
              name="address"
              register={register}
              error={errors.address}
            />
            <CustomInput
              label="Blood Type"
              name="bloodType"
              register={register}
              error={errors.bloodType}
            />
            <CustomInput
              label="Birthday"
              name="birthday"
              type="date"
              register={register}
              error={errors.birthday}
            />
          </div>
        </section>

        <section className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                {...register("sex")}
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
              {errors.sex && (
                <p className="mt-1 text-sm text-red-600">{errors.sex.message}</p>
              )}
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subjects
              </label>
              <select
                multiple
                className="w-full p-2 border border-gray-300 rounded-md"
                {...register("subjects")}
              >
                {subjects.map((subject: { id: number; name: string }) => (
                  <option value={subject.id} key={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
              {errors.subjects && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.subjects.message}
                </p>
              )}
            </div>
          </div>
        </section>

        <ImageUpload
          label="Profile Photo"
          onUploadComplete={(url) => setImageUrl(url)}
          initialImage={data?.img}
        />

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

export default TeacherShedularForm;
