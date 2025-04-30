"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { studentSchema, StudentSchema } from "@/lib/formValidationSchemas";
import { useFormState } from "react-dom";
import { createStudent, updateStudent } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { CldUploadWidget } from "next-cloudinary";

interface Props {
  mode: "create" | "update";
  initialData?: any;
  closeModal: Dispatch<SetStateAction<boolean>>;
  metadata?: { grades: any[]; classes: any[] };
}

const StudentForm = ({ mode, initialData, closeModal, metadata }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StudentSchema>({
    resolver: zodResolver(studentSchema),
  });

  const [uploadedImg, setUploadedImg] = useState<any>();

  const [submissionState, triggerAction] = useFormState(
    mode === "create" ? createStudent : updateStudent,
    { success: false, error: false }
  );

  const router = useRouter();

  const submitHandler = handleSubmit((formData) => {
    triggerAction({ ...formData, img: uploadedImg?.secure_url });
  });

  useEffect(() => {
    if (submissionState.success) {
      toast.success(`Student successfully ${mode === "create" ? "added" : "modified"}`);
      closeModal(false);
      router.refresh();
    }
  }, [submissionState, mode, closeModal, router]);

  const { grades, classes } = metadata || { grades: [], classes: [] };

  return (
    <form className="flex flex-col gap-8" onSubmit={submitHandler}>
      <h2 className="text-xl font-semibold">
        {mode === "create" ? "Register Student" : "Edit Student Info"}
      </h2>

      <section>
        <span className="text-xs text-gray-400 font-medium">Account Details</span>
        <div className="flex flex-wrap gap-4">
          <InputField label="Username" name="username" defaultValue={initialData?.username} register={register} error={errors.username} />
          <InputField label="Email" name="email" defaultValue={initialData?.email} register={register} error={errors.email} />
          <InputField label="Password" type="password" name="password" defaultValue={initialData?.password} register={register} error={errors.password} />
        </div>
      </section>

      <section>
        <span className="text-xs text-gray-400 font-medium">Personal Details</span>

        <CldUploadWidget
          uploadPreset="school"
          onSuccess={(result, { widget }) => {
            setUploadedImg(result.info);
            widget.close();
          }}
        >
          {({ open }) => (
            <div onClick={open} className="cursor-pointer text-xs text-gray-500 flex items-center gap-2">
              <Image src="/upload.png" alt="Upload Icon" width={28} height={28} />
              <span>Upload Image</span>
            </div>
          )}
        </CldUploadWidget>

        <div className="flex flex-wrap gap-4">
          <InputField label="First Name" name="name" defaultValue={initialData?.name} register={register} error={errors.name} />
          <InputField label="Last Name" name="surname" defaultValue={initialData?.surname} register={register} error={errors.surname} />
          <InputField label="Phone" name="phone" defaultValue={initialData?.phone} register={register} error={errors.phone} />
          <InputField label="Address" name="address" defaultValue={initialData?.address} register={register} error={errors.address} />
          <InputField label="Blood Type" name="bloodType" defaultValue={initialData?.bloodType} register={register} error={errors.bloodType} />
          <InputField label="Birthday" name="birthday" type="date" defaultValue={initialData?.birthday?.toISOString()?.split("T")[0]} register={register} error={errors.birthday} />
          <InputField label="Parent ID" name="parentId" defaultValue={initialData?.parentId} register={register} error={errors.parentId} />
          {initialData?.id && (
            <InputField label="ID" name="id" defaultValue={initialData.id} register={register} error={errors.id} hidden />
          )}

          <div className="flex flex-col gap-2 w-full md:w-1/4">
            <label className="text-xs text-gray-500">Sex</label>
            <select {...register("sex")} defaultValue={initialData?.sex} className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full">
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
            {errors.sex && <p className="text-xs text-red-400">{errors.sex.message?.toString()}</p>}
          </div>

          <div className="flex flex-col gap-2 w-full md:w-1/4">
            <label className="text-xs text-gray-500">Grade</label>
            <select {...register("gradeId")} defaultValue={initialData?.gradeId} className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full">
              {grades.map((grade) => (
                <option value={grade.id} key={grade.id}>{grade.level}</option>
              ))}
            </select>
            {errors.gradeId && <p className="text-xs text-red-400">{errors.gradeId.message?.toString()}</p>}
          </div>

          <div className="flex flex-col gap-2 w-full md:w-1/4">
            <label className="text-xs text-gray-500">Class</label>
            <select {...register("classId")} defaultValue={initialData?.classId} className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full">
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  ({c.name} - {c._count.students}/{c.capacity} Capacity)
                </option>
              ))}
            </select>
            {errors.classId && <p className="text-xs text-red-400">{errors.classId.message?.toString()}</p>}
          </div>
        </div>
      </section>

      {submissionState.error && (
        <p className="text-red-500">Something went wrong. Please try again.</p>
      )}

      <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-md">
        {mode === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default StudentForm;
