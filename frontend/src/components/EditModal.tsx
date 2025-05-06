import { Controller, useForm } from 'react-hook-form';
import { format } from 'date-fns';
import ModalPortal from './ModalPortal'; // ModalPortalコンポーネントをインポート
import { Input } from './ui/input';
import { Button } from './ui/button';

export interface EventDatas {
  id: string;
  event: string;
  date: string; // ISO 8601形式の文字列
  createdAt: string; // ISO 8601形式の文字列
  updateAt?: string;
}

interface EditModalProps {
  toggleEditModal: () => void;
  onEdit: (onEditData: EditEventDatas) => void;
  selectedEventDatas: EventDatas;
}

export interface EditEventDatas {
  id: string;
  event: string;
}

const EditModal = ({ toggleEditModal, onEdit, selectedEventDatas }: EditModalProps) => {
  const { id, event, date } = selectedEventDatas;
  const FormatDate = format(new Date(date), 'yyy年MM月dd日');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<EditEventDatas>({
    defaultValues: { id, event },
    shouldUnregister: false,
  });

  // フォーム送信時の処理
  const onSubmit = (editData: EditEventDatas) => {
    onEdit(editData);
    reset(editData);
    toggleEditModal();
  };

  return (
    <ModalPortal>
      <div className="modal-container">
        <div className="modal">
          <h2 className="mb-5">{FormatDate}</h2>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* <input type="hidden" {...register('id', { value: 'id' })} /> */}
            <input type="text" {...register('id')} />
            <Controller
              name="event"
              control={control}
              rules={{ required: '予定を追加してください。' }}
              render={({ field }) => <Input {...field} placeholder="予定を編集してください" className="input-field" />}
            />
            {errors.event && <p className="text-amber-800 ml-3 mt-3">{errors.event.message}</p>}
            <div className="flex justify-end mt-6">
              <Button onClick={toggleEditModal} variant="outline">
                閉じる
              </Button>
              <Button type="submit" variant="destructive" className="ml-3 ">
                更新
              </Button>
            </div>
          </form>
        </div>
      </div>
    </ModalPortal>
  );
};

export default EditModal;
