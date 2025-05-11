import { useEffect, useState } from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';
import AddModal from './AddModal';
import EditModal, { EditEventDatas } from './EditModal';
import apiInstance from '@/api/apiInstance';

export interface EventDatas {
  id: string;
  event: string;
  date: string; // ISO 8601形式の文字列
  createdAt: string; // ISO 8601形式の文字列
  updateAt?: string;
}

interface AddEventDates {
  event: string;
  date: string;
}

const CalendarComponent = () => {
  const [selectedEventDatas, setSelectedEventDatas] = useState<EventDatas | null>(null);
  // console.log('親コンポーネントの state 更新');
  const [date, setDate] = useState<Date>(new Date());
  const [datas, setDatas] = useState<EventDatas[]>([]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const toggleAddModal = () => {
    console.log('モーダルの現在の状態:', isAddModalOpen);
    setIsAddModalOpen((prev) => !prev);
  };

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    console.log('モーダルの状態が変更されました:', isAddModalOpen);
  }, [isAddModalOpen]);

  const toggleEditModal = () => {
    setIsEditModalOpen((prev) => !prev);
  };

  useEffect(() => {
    const fetchDate = async () => {
      try {
        const response = await apiInstance.get('/api/events', {
          withCredentials: true, // 必要なら CORS の認証情報を送信
        });
        if (response && response.data) {
          setDatas(response.data);
        } else {
          console.warn('No data found in the response');
          setDatas([]); // データがない場合は空の配列を設定
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchDate();
  }, []);

  const handleDateClick = (date: Date) => {
    if ((event?.target as HTMLElement).closest('.delete-icon')) return;
    if ((event?.target as HTMLElement).closest('.tag')) return;
    console.log('カレンダーの日付セルがクリックされました');
    setDate(date);
    toggleAddModal();
  };

  const handleAddData = async (newEventDatas: AddEventDates) => {
    console.log('toggleAddModal called');
    try {
      const response = await apiInstance.post('/api/events', newEventDatas, {
        headers: { 'Content-Type': 'application/json' },
      });
      setDatas((prev) => [...prev, response.data]);
    } catch (error) {
      console.error('Error post data:', error);
    }
  };

  const handleEditData = async (editData: EditEventDatas) => {
    const { event } = editData;

    try {
      const response = await apiInstance.patch(`/api/events/${editData.id}`, { event });

      if (response.status === 200) {
        console.log(response.data);
        console.log(response.status);
        setDatas((prev: EventDatas[]) =>
          prev.map((data: EventDatas) => (data.id === editData.id ? { ...data, ...editData } : data))
        );
      }
    } catch (error) {
      console.error('Error patch data:', error);
    }
  };

  const handleDeleteData = async (eventId: string) => {
    const isConfirmed = window.confirm('この予定を削除してもよいですか？');
    if (isConfirmed) {
      try {
        const response = await apiInstance.delete(`/api/events/${eventId}`);
        console.log('Event deleted: ', response.data);
        setDatas((prev) => prev?.filter((data) => data.id !== eventId));
      } catch (error) {
        console.error('Error delete data:', error);
      }
    }
  };

  const handleSelectedEventData = (editEventData: EventDatas) => {
    setSelectedEventDatas(editEventData);
    toggleEditModal();
  };

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <Calendar
        onClickDay={handleDateClick}
        tileClassName="calendar-tile"
        tileContent={({ date }) => {
          const eventsForDate = datas.filter((event) => new Date(event.date).toDateString() === date.toDateString());

          return (
            <div data-testid={`date-${date.getDate()}`} className="tags">
              {eventsForDate.map((tag) => {
                // console.log('Rendering tag:', tag.id);
                return (
                  <div key={tag.id}>
                    <div
                      className="tag"
                      title="編集はここクリック！"
                      onClick={() => {
                        handleSelectedEventData(tag);
                      }}
                    >
                      {tag.event}
                    </div>
                    <div
                      className="rounded-lg text-xs bg-amber-100 text-red-500 hover:text-red-700 ml-2 pl-1.5 pr-1.5 delete-icon"
                      onClick={() => handleDeleteData(tag.id)}
                    >
                      ✖
                    </div>
                  </div>
                );
              })}
            </div>
          );
        }}
      />
      {isAddModalOpen &&
        (console.log('モーダルが描画されました。'),
        (<AddModal toggleAddModal={toggleAddModal} onAdd={handleAddData} date={date} />))}
      {isEditModalOpen && selectedEventDatas && (
        <EditModal toggleEditModal={toggleEditModal} onEdit={handleEditData} selectedEventDatas={selectedEventDatas} />
      )}
    </div>
  );
};

export default CalendarComponent;
