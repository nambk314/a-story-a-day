import { mockAudioContent } from './audio';

export const mockStory = {
  id: '1',
  title: 'The Journey Begins',
  content: `In a small village nestled among rolling hills, there lived a curious young girl named Maya. Every morning, she would wake up early to watch the sunrise paint the sky in brilliant shades of orange and pink. One day, she discovered an old map in her grandmother's attic, marking the location of a mysterious garden said to bloom with flowers that glowed in the moonlight.

Determined to find this magical place, Maya prepared for her adventure. She packed her favorite notebook, a compass, and some snacks. As she followed the map's winding path through the forest, she encountered friendly animals who seemed to guide her way. The journey wasn't easy, but Maya's determination never wavered.

Finally, as the sun began to set, she reached a hidden valley. There, just as the old stories told, hundreds of luminescent flowers began to glow, creating a spectacular display of natural beauty. Maya realized that sometimes the most extraordinary discoveries await those who are brave enough to follow their curiosity.`,
  translation: `Trong một ngôi làng nhỏ nằm giữa những ngọn đồi thoai thoải, có một cô bé tò mò tên là Maya. Mỗi sáng, cô thức dậy sớm để ngắm bình minh vẽ lên bầu trời những sắc màu cam và hồng rực rỡ. Một ngày nọ, cô phát hiện ra một tấm bản đồ cũ trong gác xép của bà, đánh dấu vị trí một khu vườn bí ẩn được cho là nở rộ những bông hoa phát sáng trong ánh trăng.

Quyết tâm tìm ra nơi kỳ diệu này, Maya chuẩn bị cho cuộc phiêu lưu của mình. Cô đóng gói cuốn sổ tay yêu thích, một chiếc la bàn và một ít đồ ăn nhẹ. Khi theo con đường quanh co trên bản đồ xuyên qua khu rừng, cô gặp những con vật thân thiện dường như đang chỉ đường cho cô. Hành trình không hề dễ dàng, nhưng quyết tâm của Maya chưa bao giờ lung lay.

Cuối cùng, khi mặt trời bắt đầu lặn, cô đến được một thung lũng ẩn khuất. Ở đó, đúng như những câu chuyện cũ kể lại, hàng trăm bông hoa phát quang bắt đầu tỏa sáng, tạo nên một khung cảnh thiên nhiên tuyệt đẹp. Maya nhận ra rằng đôi khi những khám phá phi thường nhất đang chờ đợi những người đủ can đảm để theo đuổi sự tò mò của mình.`,
  language: 'English',
  level: 'intermediate',
  audio: mockAudioContent, // Base64 encoded audio content
  audio_url: null, // Will be created from the audio content
  created_at: new Date().toISOString()
};