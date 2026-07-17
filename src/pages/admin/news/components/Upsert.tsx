import { Card, CardBody, CardHeader } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

import { AttendanceForm } from "./forms";

import {
  createAttendanceMutation,
  updateAttendanceMutation,
} from "@/common/mutations";
import { getAttendanceQuery, queryKeysAttendances } from "@/common/queries";
import {
  AttendanceCreate,
  attendanceCreateSchema,
  AttendanceUpdate,
  attendanceUpdateSchema,
} from "@/common/validations";
import { HeaderWithActions } from "@/components/ui/HeaderWithActions";
import { usePermission } from "@/hooks/use-permission";
import UnauthorizedError from "@/pages/errors/unauthorized-error";
import { Permission } from "@/types";
import { notify } from "@/utils/notify.util";

export const UpsertAttendance = () => {
  const { id } = useParams();
  const isCreate = !id;

  const navigate = useNavigate();
  const [isSaveAndRemain, setIsSaveAndRemain] = useState(false);
  const queryClient = useQueryClient();

  const { data: attendance, isLoading } = useQuery({
    enabled: !!id,
    queryKey: [queryKeysAttendances.get_attendance, id],
    queryFn: async () => getAttendanceQuery(id!),
  });

  // Escolha de schema e tipo do formulário
  const schema = isCreate ? attendanceCreateSchema : attendanceUpdateSchema;

  type FormType = typeof schema._type;

  const methods = useForm<FormType>({
    defaultValues: {},
    resolver: zodResolver(schema),
  });

  // Mutations de criação e edição
  const mutation = useMutation({
    mutationFn: (data: FormType) =>
      isCreate
        ? createAttendanceMutation(data as AttendanceCreate)
        : updateAttendanceMutation(data as AttendanceUpdate),
    onSuccess: async () => {
      notify(isCreate ? "Criado com sucesso!" : "Atualizado com sucesso!", {
        type: "success",
      });

      if (!isCreate) {
        await queryClient.invalidateQueries({
          queryKey: [queryKeysAttendances.get_attendance, id],
        });
      }

      await queryClient.invalidateQueries({
        queryKey: [queryKeysAttendances.get_list_attendances],
      });

      if (!isSaveAndRemain) navigate(-1);
    },
    onError: (error: any) => {
      notify(
        `Erro ao ${isCreate ? "criar" : "atualizar"}.\n${
          error.response?.data?.message || ""
        }`,
        { type: "error" },
      );
    },
  });

  // Atualiza os valores iniciais no modo edição
  useEffect(() => {
    if (attendance && !isCreate) {
      methods.reset({ ...attendance });
    }
  }, [attendance, isCreate, methods]);

  const onSubmit = methods.handleSubmit((data) => {
    if (!isCreate) {
      (data as AttendanceUpdate).id = Number(id!);
    }
    mutation.mutate(data);
  });

  const { permission } = usePermission(Permission.ATTENDANCE, "read_write");

  if (!permission || !(permission === "read_write"))
    return <UnauthorizedError />;

  return (
    <Card className="w-full bg-opacity-45">
      <FormProvider {...methods}>
        <form onSubmit={onSubmit}>
          <CardHeader>
            <HeaderWithActions
              isLoading={mutation.isPending || isLoading}
              title={isCreate ? "Criar frequência" : "Editar frequência"}
              onIsSaveAndRemain={setIsSaveAndRemain}
            />
          </CardHeader>
          <CardBody>
            <AttendanceForm />
          </CardBody>
        </form>
      </FormProvider>
    </Card>
  );
};
