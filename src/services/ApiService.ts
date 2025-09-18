import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Получение токена доступа TikTok
  async getTikTokAccessToken(authCode: string): Promise<string> {
    try {
      const response = await axios.post(`${this.baseURL}/auth/tiktok`, {
        code: authCode
      });
      return response.data.access_token;
    } catch (error) {
      console.error('Ошибка получения токена TikTok:', error);
      throw new Error('Не удалось получить токен доступа');
    }
  }

  // Публикация видео через TikTok API
  async publishVideo(videoData: {
    videoFile: File;
    description: string;
    privacyLevel: string;
    accessToken: string;
  }): Promise<{ success: boolean; videoId?: string; error?: string }> {
    try {
      const formData = new FormData();
      formData.append('video', videoData.videoFile);
      formData.append('description', videoData.description);
      formData.append('privacy_level', videoData.privacyLevel);
      formData.append('access_token', videoData.accessToken);

      const response = await axios.post(`${this.baseURL}/publish/video`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 300000, // 5 минут для загрузки видео
      });

      return {
        success: true,
        videoId: response.data.video_id
      };
    } catch (error: any) {
      console.error('Ошибка публикации видео:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Ошибка при публикации видео'
      };
    }
  }

  // Получение информации о пользователе TikTok
  async getTikTokUserInfo(accessToken: string): Promise<{
    id: string;
    username: string;
    displayName: string;
    avatarUrl?: string;
  }> {
    try {
      const response = await axios.get(`${this.baseURL}/user/info`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      return {
        id: response.data.id,
        username: response.data.username,
        displayName: response.data.display_name,
        avatarUrl: response.data.avatar_url
      };
    } catch (error) {
      console.error('Ошибка получения информации о пользователе:', error);
      throw new Error('Не удалось получить информацию о пользователе');
    }
  }

  // Получение статуса публикации
  async getPublishStatus(videoId: string, accessToken: string): Promise<{
    status: 'PROCESSING' | 'PUBLISHED' | 'FAILED';
    message?: string;
  }> {
    try {
      const response = await axios.get(`${this.baseURL}/publish/status/${videoId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      return response.data;
    } catch (error) {
      console.error('Ошибка получения статуса:', error);
      throw new Error('Не удалось получить статус публикации');
    }
  }

  // Получение списка опубликованных видео
  async getPublishedVideos(accessToken: string): Promise<Array<{
    id: string;
    description: string;
    status: string;
    publishedAt: string;
    thumbnailUrl?: string;
  }>> {
    try {
      const response = await axios.get(`${this.baseURL}/videos`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      return response.data.videos;
    } catch (error) {
      console.error('Ошибка получения списка видео:', error);
      throw new Error('Не удалось получить список видео');
    }
  }
}

export default new ApiService();
