import { AutocompleteItem } from "@heroui/react";
import { getLocalTimeZone, parseDate } from "@internationalized/date";
import { GraduationCap, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { IFilterAttendances } from "@/common/queries";
import { AutocompleteCustom, InputCustom } from "@/components/ui";
import { DatePickerCustom } from "@/components/ui/DatePickerCustom";
import { TClassroomDiscipline } from "@/types";
import { getCurrentDateString } from "@/utils/get-locale-date";

interface SearchProps {
  classroomDisciplines: TClassroomDiscipline[];
  filterAttendances?: IFilterAttendances;
  setFilterAttendances?: (filter: IFilterAttendances) => void;
}

export const SearchAttendance = ({
  classroomDisciplines,
  filterAttendances,
  setFilterAttendances,
}: SearchProps) => {
  const [search, setSearch] = useState(filterAttendances?.studentName ?? "");

  const clearStudentName = () => {
    setSearch("");
  };

  // debounce effect
  useEffect(() => {
    const handler = setTimeout(() => {
      setFilterAttendances?.({
        ...filterAttendances,
        studentName: search || undefined,
      });
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  // Disciplinas filtradas pela turma
  const disciplinesOptions = useMemo(() => {
    if (!filterAttendances?.classroomId) return [];

    const filtered = classroomDisciplines?.filter(
      (item) => item.classroomId === filterAttendances?.classroomId,
    );

    const unique = new Map();

    filtered?.forEach((item) => {
      if (!unique.has(item.disciplineId)) {
        unique.set(item.disciplineId, item);
      }
    });

    return Array.from(unique.values()).map((item) => ({
      label: item.discipline?.name ?? "",
      key: String(item.disciplineId),
    }));
  }, [classroomDisciplines, filterAttendances?.classroomId]);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,220px)_minmax(0,1fr)]">
        <div className="space-y-1.5">
          <p className="px-1 text-sm font-medium text-slate-700">Data</p>
          <DatePickerCustom
            radius="full"
            value={
              filterAttendances?.lessonDate
                ? parseDate(filterAttendances?.lessonDate)
                : undefined
            }
            onChange={(value) => {
              const dateObj = value?.toDate(getLocalTimeZone());

              const date = dateObj ? getCurrentDateString(dateObj) : undefined;

              setFilterAttendances?.({
                ...filterAttendances,
                lessonDate: date,
              });
            }}
          />
        </div>

        <div className="space-y-1.5">
          <p className="px-1 text-sm font-medium text-slate-700">Disciplina</p>
          <AutocompleteCustom
            defaultItems={disciplinesOptions}
            isLoading={false}
            isClearable={false}
            placeholder="Selecione a disciplina"
            radius="full"
            selectedKey={
              filterAttendances?.disciplineId
                ? String(filterAttendances.disciplineId)
                : undefined
            }
            startContent={<GraduationCap className="mr-2 h-5 w-5" />}
            onSelectionChange={(key) => {
              const disciplineId = key ? String(key) : undefined;

              if (!disciplineId) {
                setFilterAttendances?.({
                  ...filterAttendances,
                  disciplineId: undefined,
                });

                return;
              }

              setFilterAttendances?.({
                ...filterAttendances,
                disciplineId: Number(disciplineId),
              });
            }}
          >
            {(item: any) => (
              <AutocompleteItem key={item.key}>{item.label}</AutocompleteItem>
            )}
          </AutocompleteCustom>
        </div>
      </div>

      <div className="space-y-1.5">
        <p className="px-1 text-sm font-medium text-slate-700">Aluno</p>
        <InputCustom
          isClearable
          aria-label="Pesquisa por aluno"
          classNames={{
            input: "text-sm",
          }}
          placeholder="Pesquisar por aluno"
          radius="full"
          startContent={<Search className="h-5 w-5 opacity-50" />}
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClear={clearStudentName}
        />
      </div>
    </div>
  );
};
