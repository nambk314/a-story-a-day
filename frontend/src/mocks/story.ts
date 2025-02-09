import audioData from './audioMock.json'
import { Story } from '../types';

const left = "Max is brown and very playful. One sunny day, Sam takes Max to the park. They see many other dogs and people. Max runs and plays with a big dog. They chase a ball together. Sam laughs and claps. After playing, they sit under a tree. Sam gives Max some water and a snack. Max wags his tail and looks very happy. \"Good boy, Max!\" says Sam. They enjoy the sunny day together.";
const translationLeft = "Max có màu nâu và rất nghịch ngợm. Một ngày nắng đẹp, Sam dẫn Max đi đến công viên. Họ thấy nhiều chó và người khác. Max chạy nhảy và chơi với một con chó lớn. Chúng đuổi theo một quả bóng cùng nhau. Sam cười và vỗ tay. Sau khi chơi, họ ngồi dưới một cái cây. Sam cho Max chút nước và một món ăn nhẹ. Max vẫy đuôi và trông rất vui vẻ. \"Chàng trai tốt, Max!\" Sam nói. Họ cùng nhau tận hưởng ngày nắng.";

export const mockStory: Story = {
  "id": "1",
  "title": "Daily English Story",
  "content": "Sam has a small dog named Max.",
  "translation": "Sam có một chú chó nhỏ tên là Max.",
  "audio": audioData.audio,
  "language": "en",
  "level": "beginner",
  "created_at": "2025-01-26T21:20:07.449Z"
  };

export const useMockStory = import.meta.env.VITE_USE_MOCK_STORY === 'true';