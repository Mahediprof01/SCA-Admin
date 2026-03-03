import axios, {
  AxiosInstance,
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

// Types
export interface Contact {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt?: string;
  updatedAt?: string;
}

export interface Consultation {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  phone: string;
  status: 'pending' | 'contacted' | 'completed' | 'cancelled';
  createdAt?: string;
  updatedAt?: string;
}

export interface ConsultationsResponse {
  data: Consultation[];
  total: number;
  page: number;
  limit: number;
}

export interface University {
  _id?: string;
  id?: string;
  name: string;
  description: string;
  location: string;
  country: string;
  established?: number;
  type: 'public' | 'private';
  ranking?: number;
  tuitionFee?: string;
  website?: string;
  email?: string;
  phone?: string;
  image?: string;
  programs: string[];
  facilities: string[];
  status: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
}

export interface UniversitiesResponse {
  data: University[];
  total: number;
  page: number;
  limit: number;
}

export interface UniversityStats {
  total: number;
  active: number;
  inactive: number;
  countries: number;
  publicType: number;
  privateType: number;
}

export interface Review {
  _id?: string;
  id?: string;
  name: string;
  university: string;
  quote: string;
  rating: number;
  status: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
}

export interface ReviewsResponse {
  data: Review[];
  total: number;
  page: number;
  limit: number;
}

export interface ReviewStats {
  total: number;
  active: number;
  inactive: number;
  averageRating: number;
}

export interface SuccessStory {
  _id?: string;
  id?: string;
  type: 'image' | 'video';
  title?: string;
  description?: string;
  imageUrl?: string;
  videoUrl?: string;
  status: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
}

export interface ContactsResponse {
  data: Contact[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

// API Client Configuration
class ApiClient {
  private axiosInstance: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL =
      process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      // Increased timeout to 60 seconds for file uploads to Cloudinary
      timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '60000'),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // Add any authentication headers if needed
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        // For FormData, delete Content-Type header so browser/axios can set multipart/form-data with boundary
        if (config.data instanceof FormData) {
          delete config.headers['Content-Type'];
        }
        
        return config;
      },
      (error: AxiosError) => {
        console.error('Request error:', error);
        return Promise.reject(error);
      },
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError<ApiError>) => {
        const errorMessage = error.response?.data?.message || error.message;
        const statusCode = error.response?.status || 500;

        console.error(`API Error [${statusCode}]:`, errorMessage);

        // Handle specific status codes
        if (statusCode === 401) {
          // Unauthorized - clear auth and redirect
          localStorage.removeItem('authToken');
          // Optionally redirect to login
        }

        if (statusCode === 403) {
          // Forbidden
          console.warn('Access forbidden');
        }

        return Promise.reject({
          message: errorMessage,
          statusCode,
          error: error.response?.data?.error,
        } as ApiError);
      },
    );
  }

  // Contacts Endpoints
  public async getContacts(
    page: number = 1,
    limit: number = 10,
    status?: string,
    search?: string,
  ): Promise<ContactsResponse> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (status) params.append('status', status);
    if (search) params.append('search', search);

    const response = await this.axiosInstance.get<ContactsResponse>(
      `/contacts?${params.toString()}`,
    );
    return response.data;
  }

  public async getContactById(id: string): Promise<Contact> {
    const response = await this.axiosInstance.get<Contact>(
      `/contacts/${id}`,
    );
    return response.data;
  }

  public async createContact(contact: Omit<Contact, '_id' | 'createdAt' | 'updatedAt'>): Promise<Contact> {
    const response = await this.axiosInstance.post<Contact>(
      '/contacts',
      contact,
    );
    return response.data;
  }

  public async updateContact(
    id: string,
    contact: Partial<Contact>,
  ): Promise<Contact> {
    const response = await this.axiosInstance.put<Contact>(
      `/contacts/${id}`,
      contact,
    );
    return response.data;
  }

  public async deleteContact(id: string): Promise<void> {
    await this.axiosInstance.delete(`/contacts/${id}`);
  }

  public async getContactStats(): Promise<any> {
    const response = await this.axiosInstance.get('/contacts/stats/overview');
    return response.data;
  }

  // Consultations Endpoints
  public async getConsultations(
    page: number = 1,
    limit: number = 10,
    status?: string,
    search?: string,
  ): Promise<ConsultationsResponse> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (status) params.append('status', status);
    if (search) params.append('search', search);

    const response = await this.axiosInstance.get<ConsultationsResponse>(
      `/consultations?${params.toString()}`,
    );
    return response.data;
  }

  public async getConsultationById(id: string): Promise<Consultation> {
    const response = await this.axiosInstance.get<Consultation>(
      `/consultations/${id}`,
    );
    return response.data;
  }

  public async updateConsultation(
    id: string,
    consultation: Partial<Consultation>,
  ): Promise<Consultation> {
    const response = await this.axiosInstance.put<Consultation>(
      `/consultations/${id}`,
      consultation,
    );
    return response.data;
  }

  public async deleteConsultation(id: string): Promise<void> {
    await this.axiosInstance.delete(`/consultations/${id}`);
  }

  public async getConsultationStats(): Promise<any> {
    const response = await this.axiosInstance.get('/consultations/stats/overview');
    return response.data;
  }

  // Universities Endpoints
  public async getUniversities(
    page: number = 1,
    limit: number = 10,
    status?: string,
    country?: string,
    search?: string,
  ): Promise<UniversitiesResponse> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (status) params.append('status', status);
    if (country) params.append('country', country);
    if (search) params.append('search', search);

    const response = await this.axiosInstance.get<UniversitiesResponse>(
      `/universities?${params.toString()}`,
    );
    return response.data;
  }

  public async getUniversityById(id: string): Promise<University> {
    const response = await this.axiosInstance.get<University>(
      `/universities/${id}`,
    );
    return response.data;
  }

  public async createUniversity(
    university: Omit<University, '_id' | 'createdAt' | 'updatedAt'> | FormData,
  ): Promise<University> {
    const response = await this.axiosInstance.post<University>(
      '/universities',
      university,
    );
    return response.data;
  }

  public async updateUniversity(
    id: string,
    university: Partial<University> | FormData,
  ): Promise<University> {
    const response = await this.axiosInstance.put<University>(
      `/universities/${id}`,
      university,
    );
    return response.data;
  }

  public async deleteUniversity(id: string): Promise<void> {
    await this.axiosInstance.delete(`/universities/${id}`);
  }

  public async getUniversityStats(): Promise<UniversityStats> {
    const response = await this.axiosInstance.get<UniversityStats>(
      '/universities/stats/overview',
    );
    return response.data;
  }

  // Reviews Endpoints
  public async getReviews(
    page: number = 1,
    limit: number = 10,
    status?: string,
    search?: string,
  ): Promise<ReviewsResponse> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (status) params.append('status', status);
    if (search) params.append('search', search);

    const response = await this.axiosInstance.get<ReviewsResponse>(
      `/reviews?${params.toString()}`,
    );
    return response.data;
  }

  public async getReviewById(id: string): Promise<Review> {
    const response = await this.axiosInstance.get<Review>(`/reviews/${id}`);
    return response.data;
  }

  public async createReview(
    review: Omit<Review, '_id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Review> {
    const response = await this.axiosInstance.post<Review>('/reviews', review);
    return response.data;
  }

  public async updateReview(
    id: string,
    review: Partial<Review>,
  ): Promise<Review> {
    const response = await this.axiosInstance.put<Review>(
      `/reviews/${id}`,
      review,
    );
    return response.data;
  }

  public async deleteReview(id: string): Promise<void> {
    await this.axiosInstance.delete(`/reviews/${id}`);
  }

  public async getReviewStats(): Promise<ReviewStats> {
    const response = await this.axiosInstance.get<ReviewStats>(
      '/reviews/stats/overview',
    );
    return response.data;
  }

  // ==================== SUCCESS STORIES ====================

  public async getSuccessStories(type?: string, status?: string): Promise<{ data: SuccessStory[]; total: number }> {
    const params: any = {};
    if (type) params.type = type;
    if (status) params.status = status;
    const response = await this.axiosInstance.get<{ data: SuccessStory[]; total: number }>('/success-stories', { params });
    return response.data;
  }

  public async createSuccessStory(data: FormData): Promise<SuccessStory> {
    const response = await this.axiosInstance.post<SuccessStory>('/success-stories', data);
    return response.data;
  }

  public async updateSuccessStory(id: string, data: Partial<SuccessStory>): Promise<SuccessStory> {
    const response = await this.axiosInstance.put<SuccessStory>(`/success-stories/${id}`, data);
    return response.data;
  }

  public async deleteSuccessStory(id: string): Promise<void> {
    await this.axiosInstance.delete(`/success-stories/${id}`);
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
