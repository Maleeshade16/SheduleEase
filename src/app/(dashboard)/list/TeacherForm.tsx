"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";

import { teacherSchema, TeacherSchema } from "@/lib/formValidationSchemas";
import { createTeacher, updateTeacher } from "@/lib/actions";
import InputField from "../InputField";
import { useFormState } from "react-dom";

type FormProps = {
  mode: "create" | "update";
  existingData?: any;
  closeForm: Dispatch<SetStateAction<boolean>>;
  metaData?: any;
};

const TeacherForm = ({ mode, existingData, closeForm, metaData }: FormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TeacherSchema>({
    resolver: zodResolver(teacherSchema),
  });

  const router = useRouter();
  const [imageInfo, setImageInfo] = useState<any>(null);

  const [formStatus, triggerFormAction] = useFormState(
    mode === "create" ? createTeacher : updateTeacher,
    { success: false, error: false }
  );

  useEffect(() => {
    if (formStatus.success) {
      toast.success(`Teacher ${mode === "create" ? "added" : "updated"} successfully!`);
      closeForm(false);
      router.refresh();
    }
  }, [formStatus, mode, closeForm, router]);

  const handleFormSubmit = handleSubmit((formData) => {
    triggerFormAction({
      ...formData,
      img: imageInfo?.secure_url,
    });
  });

  const { subjects } = metaData;

  return (
    <form onSubmit={handleFormSubmit} className="flex flex-col gap-8">
      <h1 className="text-xl font-bold">
        {mode === "create" ? "Add New Teacher" : "Edit Teacher Info"}
      </h1>

      <section>
        <h2 className="text-sm text-gray-500">Login Credentials</h2>
        <div className="flex flex-wrap gap-4">
          <InputField label="Username" name="username" defaultValue={existingData?.username} register={register} error={errors.username} />
          <InputField label="Email" name="email" defaultValue={existingData?.email} register={register} error={errors.email} />
          <InputField label="Password" name="password" type="password" defaultValue={existingData?.password} register={register} error={errors.password} />
        </div>
      </section>

      <section>
        <h2 className="text-sm text-gray-500">Personal Information</h2>
        <div className="flex flex-wrap gap-4">
          <InputField label="First Name" name="name" defaultValue={existingData?.name} register={register} error={errors.name} />
          <InputField label="Last Name" name="surname" defaultValue={existingData?.surname} register={register} error={errors.surname} />
          <InputField label="Phone" name="phone" defaultValue={existingData?.phone} register={register} error={errors.phone} />
          <InputField label="Address" name="address" defaultValue={existingData?.address} register={register} error={errors.address} />
          <InputField label="Blood Type" name="bloodType" defaultValue={existingData?.bloodType} register={register} error={errors.bloodType} />
          <InputField label="Birthday" name="birthday" type="date" defaultValue={existingData?.birthday?.toISOString().split("T")[0]} register={register} error={errors.birthday} />

          {existingData && (
            <InputField label="ID" name="id" defaultValue={existingData?.id} register={register} error={errors.id} hidden />
          )}

          <div className="flex flex-col w-full md:w-1/4">
            <label className="text-xs text-gray-500">Sex</label>
            <select {...register("sex")} defaultValue={existingData?.sex} className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full">
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
            {errors.sex && <p className="text-xs text-red-500">{errors.sex.message}</p>}
          </div>

          <div className="flex flex-col w-full md:w-1/4">
            <label className="text-xs text-gray-500">Subjects</label>
            <select
              multiple
              {...register("subjects")}
              defaultValue={existingData?.subjects}
              className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            >
              {subjects.map((subj: { id: number; name: string }) => (
                <option value={subj.id} key={subj.id}>
                  {subj.name}
                </option>
              ))}
            </select>
            {errors.subjects && <p className="text-xs text-red-500">{errors.subjects.message}</p>}
          </div>
        </div>
      </section>

      <CldUploadWidget
        uploadPreset="school"
        onSuccess={(res, { widget }) => {
          setImageInfo(res.info);
          widget.close();
        }}
      >
        {({ open }) => (
          <div className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer" onClick={open}>
            <Image src="/upload.png" alt="Upload" width={28} height={28} />
            <span>Upload a Profile Photo</span>
          </div>
        )}
      </CldUploadWidget>

      {formStatus.error && <p className="text-red-500">An error occurred during submission.</p>}

      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
        {mode === "create" ? "Add Teacher" : "Update Info"}
      </button>
    </form>
  );
};

export default TeacherForm;
