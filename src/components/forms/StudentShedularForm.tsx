"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import CustomInput from "../CustomInput";
import { studentSchema, StudentSchema } from "@/lib/validationSchemas";
import { useFormState } from "react-dom";
import { showNotification } from "../Notification";
import { useRouter } from "next/navigation";
import ImageUpload from "../ImageUpload";

interface StudentFormProps {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any;
}

const StudentShedularForm = ({ type, data, setOpen, relatedData }: StudentFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StudentSchema>({
    resolver: zodResolver(studentSchema),
    defaultValues: data || {},
  });

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [state, formAction] = useFormState(
    type === "create" ? createStudent : updateStudent,
    { success: false, error: null }
  );

  const onSubmit = handleSubmit((formData) => {
    formAction({ ...formData, img: imageUrl });
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      showNotification(
        `Student ${type === "create" ? "created" : "updated"} successfully`
      );
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen]);

  const { grades, classes } = relatedData || { grades: [], classes: [] };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <form onSubmit={onSubmit} className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {type === "create" ? "New Student" : "Edit Student"}
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

        <ImageUpload
          label="Profile Photo"
          onUploadComplete={(url) => setImageUrl(url)}
          initialImage={data?.img}
        />

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
            <CustomInput
              label="Parent ID"
              name="parentId"
              register={register}
              error={errors.parentId}
            />
          </div>
        </section>

        <section className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                Grade
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

            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Class
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                {...register("classId")}
              >
                {classes.map(
                  (classItem: {
                    id: number;
                    name: string;
                    capacity: number;
                    _count: { students: number };
                  }) => (
                    <option value={classItem.id} key={classItem.id}>
                      {classItem.name} ({classItem._count.students}/
                      {classItem.capacity})
                    </option>
                  )
                )}
              </select>
              {errors.classId && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.classId.message}
                </p>
              )}
            </div>
          </div>
        </section>

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

export default StudentShedularForm;
