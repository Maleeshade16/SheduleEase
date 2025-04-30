"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Loader2, Trash2, Edit, Plus } from "lucide-react";
import type { FormContainerProps } from "./FormContainer";

// Lazy-loaded form components
const DynamicFormTeacher = dynamic(() => import("./forms/TeacherForm"));
const DynamicFormStudent = dynamic(() => import("./forms/StudentForm"));
const DynamicFormSubject = dynamic(() => import("./forms/SubjectForm"));
const DynamicFormClass = dynamic(() => import("./forms/ClassForm"));
const DynamicFormExam = dynamic(() => import("./forms/ExamForm"));
const DynamicFormAnnouncement = dynamic(() => import("./forms/AnnouncementForm"));
const DynamicFormEvent = dynamic(() => import("./forms/EventForm"));
const DynamicFormWellness = dynamic(() => import("./forms/WellnessForm"));

const FORM_COMPONENTS_MAP = {
  teacher: DynamicFormTeacher,
  student: DynamicFormStudent,
  subject: DynamicFormSubject,
  class: DynamicFormClass,
  exam: DynamicFormExam,
  announcement: DynamicFormAnnouncement,
  event: DynamicFormEvent,
  wellness: DynamicFormWellness,
};

const ACTION_TYPE_LABELS = {
  create: "Create New",
  update: "Edit",
  delete: "Delete",
};

const ACTION_ICONS = {
  create: <Plus className="mr-2 h-4 w-4" />,
  update: <Edit className="mr-2 h-4 w-4" />,
  delete: <Trash2 className="mr-2 h-4 w-4" />,
};

export const DataFormModal = ({
  table,
  type,
  data,
  id,
  relatedData,
  children,
}: FormContainerProps & { 
  relatedData?: any;
  children?: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const FormComponent = FORM_COMPONENTS_MAP[table];
  const action = getActionHandler(table);

  const [state, formAction] = useFormState(action, {
    success: false,
    error: null,
  });

  const title = useMemo(() => {
    const tableName = table.charAt(0).toUpperCase() + table.slice(1);
    if (type === "create") return `${ACTION_TYPE_LABELS.create} ${tableName}`;
    if (type === "update") return `${ACTION_TYPE_LABELS.update} ${tableName}`;
    return `Confirm ${ACTION_TYPE_LABELS.delete} ${tableName}`;
  }, [table, type]);

  const buttonVariant = useMemo(() => {
    return {
      create: "success",
      update: "default",
      delete: "destructive",
    }[type];
  }, [type]);

  const buttonLabel = useMemo(() => ACTION_TYPE_LABELS[type], [type]);
  const buttonIcon = useMemo(() => ACTION_ICONS[type], [type]);

  useEffect(() => {
    if (state.success) {
      const actionVerb = type === "delete" ? "deleted" : type === "create" ? "created" : "updated";
      toast.success(`${title} ${actionVerb} successfully`);
      setIsOpen(false);
      router.refresh();
    } else if (state.error) {
      toast.error(state.error);
    }
    setIsPending(false);
  }, [state, router, title, type]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    const form = e.currentTarget as HTMLFormElement;
    form.requestSubmit();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {children ? (
        <DialogTrigger asChild>{children}</DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <Button variant={buttonVariant} size="sm">
            {buttonIcon}
            {buttonLabel}
          </Button>
        </DialogTrigger>
      )}
      
      <DialogContent className="max-w-[90vw] md:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            {title}
          </DialogTitle>
        </DialogHeader>

        {type === "delete" ? (
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <input type="hidden" name="id" value={id} />
            <p className="text-center text-gray-600 dark:text-gray-400">
              Are you sure you want to delete this {table}? This action cannot be undone.
            </p>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="destructive"
                disabled={isPending}
              >
                {isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Confirm Delete
              </Button>
            </DialogFooter>
          </form>
        ) : (
          FormComponent && (
            <FormComponent
              type={type}
              data={data}
              setOpen={setIsOpen}
              relatedData={relatedData}
              isPending={isPending}
              setIsPending={setIsPending}
            />
          )
        )}
      </DialogContent>
    </Dialog>
  );
};

// Helper function to get appropriate action handler
function getActionHandler(table: string) {
  // Implement your own action handlers here
  // This is just a placeholder
  return async (prevState: any, formData: FormData) => {
    try {
      // Your implementation here
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: "An error occurred" };
    }
  };
}

export default DataFormModal;
