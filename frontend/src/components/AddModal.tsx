import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { format } from 'date-fns';
import ModalPortal from './ModalPortal'; // ModalPortalコンポーネントをインポート
import { Input } from './ui/input';
// import { Button } from './ui/button';
import Button from '@mui/material/Button';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextField } from '@mui/material';

interface AddModalProps {
  toggleAddModal: () => void;
  onAdd: (addEventDates: AddEventDates) => void;
  date: Date;
}

// interface EventInput {
//   event: string;
// }

interface AddEventDates {
  event: string;
  date: string;
}

const eventSchema = z.object({
  event: z.string().min(1, '一文字以上の入力が必要です。').max(20, '20文字以内で入力してください。'),
});

type EventInput = z.infer<typeof eventSchema>;

const AddModal = ({ toggleAddModal, onAdd, date }: AddModalProps) => {
  const FormatDate = format(date, 'yyy年MM月dd日');

  const {
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<EventInput>({
    resolver: zodResolver(eventSchema),
    defaultValues: { event: '' },
  });

  // フォーム送信時の処理
  const onSubmit = (eventData: EventInput) => {
    const dateToString = date.toISOString();
    const newEventDatas = { ...eventData, date: dateToString };
    // console.log(newEventDatas);
    onAdd(newEventDatas);
    reset();
    toggleAddModal();
  };

  return (
    <ModalPortal>
      <div className="modal-container">
        <div className="modal" role="dialog" data-testid="modal">
          <h2 className="mb-5">{FormatDate}</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="event"
              control={control}
              // rules={{ required: '新しい予定を追加してください。' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label={typeof errors.event?.message === 'string' ? '' : '新しい予定を追加してください。'}
                  placeholder="例： アプリ開発"
                  // required
                  variant="standard"
                  // error={errors.event ? true : false }
                  error={!!errors.event}
                  helperText={typeof errors.event?.message === 'string' ? errors.event.message : ''}
                />
                // <Input {...field} placeholder="予定を追加してください" className="input-field" />}
              )}
            />
            {/* <Input
              {...register('event', { required: '予定を追加してください。' })}
              placeholder="予定を追加してください"
              className="input-field"
            /> */}

            {/* {errors.event && <p className="text-amber-800 ml-3 mt-3">{errors.event.message}</p>} */}
            <div className="flex justify-end mt-6">
              <Button onClick={toggleAddModal} variant="contained" color="inherit">
                閉じる
              </Button>
              <Button type="submit" color="primary" variant="contained" sx={{ marginLeft: '20px' }}>
                追加
              </Button>
            </div>
          </form>
        </div>
      </div>
    </ModalPortal>
  );
};

export default AddModal;
