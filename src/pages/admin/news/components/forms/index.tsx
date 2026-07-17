import { AutocompleteItem } from "@heroui/react";
import { useMemo } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { useEnrollmentListQuery, useLessonListQuery } from "@/common/queries";
import { AttendanceCreate, AttendanceUpdate } from "@/common/validations";
import { AutocompleteCustom } from "@/components/ui";

export const AttendanceForm = () => {
  type AttendanceMainFormType = AttendanceCreate | AttendanceUpdate;

  const {
    control,
    formState: { errors },
  } = useFormContext<AttendanceMainFormType>();

  const { data: enrollmentsResponse, isLoading: isLoadingEnrollments } =
    useEnrollmentListQuery({
      page: 1,
      per_page: Number.MAX_SAFE_INTEGER,
    });
  const enrollments = enrollmentsResponse?.items || [];

  const enrollmentsOptions = useMemo(() => {
    return (
      enrollments?.map((item) => ({
        label: item.student?.fullName,
        key: item.id,
      })) || []
    );
  }, [enrollments]);

  const { data: lessonsResponse, isLoading: isLoadingLessons } =
    useLessonListQuery({}, { page: 1, per_page: Number.MAX_SAFE_INTEGER });
  const lessons = lessonsResponse?.items || [];

  const lessonsOptions = useMemo(() => {
    return (
      lessons?.map((item) => ({
        label: item.topic,
        key: item.id,
      })) || []
    );
  }, [lessons]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <Controller
          control={control}
          name="enrollmentId"
          render={({ field: { onChange, onBlur, ref, value } }) => (
            <AutocompleteCustom
              ref={ref}
              defaultItems={enrollmentsOptions}
              errorMessage={errors.enrollmentId?.message}
              isInvalid={!!errors.enrollmentId}
              isLoading={isLoadingEnrollments}
              label="Aluno"
              placeholder="Selecione o aluno"
              selectedKey={String(value)}
              onBlur={onBlur}
              onSelectionChange={(key) => {
                const selected = key ? Number(key) : undefined;

                onChange(selected);
              }}
            >
              {(item: any) => (
                <AutocompleteItem key={item.key}>{item.label}</AutocompleteItem>
              )}
            </AutocompleteCustom>
          )}
        />

        <Controller
          control={control}
          name="lessonId"
          render={({ field: { onChange, onBlur, ref, value } }) => (
            <AutocompleteCustom
              ref={ref}
              defaultItems={lessonsOptions}
              errorMessage={errors.lessonId?.message}
              isInvalid={!!errors.lessonId}
              isLoading={isLoadingLessons}
              label="Aula"
              placeholder="Selecione a aula"
              selectedKey={String(value)}
              onBlur={onBlur}
              onSelectionChange={(key) => {
                const selected = key ? Number(key) : undefined;

                onChange(selected);
              }}
            >
              {(item: any) => (
                <AutocompleteItem key={item.key}>{item.label}</AutocompleteItem>
              )}
            </AutocompleteCustom>
          )}
        />
      </div>

      <Controller
        control={control}
        name="type" // <-- corrigido aqui
        render={({ field: { onChange, onBlur, ref, value } }) => (
          <AutocompleteCustom
            ref={ref}
            aria-label="Presença"
            defaultItems={presentOptions}
            errorMessage={errors.type?.message} // <-- corrigido
            isInvalid={!!errors.type} // <-- corrigido
            label="Status da disciplina"
            placeholder="Selecione o status"
            selectedKey={String(value) || undefined}
            onBlur={onBlur}
            onSelectionChange={(key) => onChange(String(key))}
          >
            {(item: any) => (
              <AutocompleteItem key={item.key}>{item.label}</AutocompleteItem>
            )}
          </AutocompleteCustom>
        )}
      />
    </div>
  );
};
