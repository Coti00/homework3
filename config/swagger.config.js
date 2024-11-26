const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  apis: ['./routes/*.js'], // 라우트 파일들의 경로
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Homework3',
      version: '1.0.0',
      description: 'homework3 documentation',
    },
    tags: [
      { name: 'User', description: 'User related operations' },
      { name: 'Bookmark', description: 'UserBookmark related operations' },
      { name: 'Application', description: 'Application related operations' },
      { name: 'Application Stats', description: 'Application Stats related operations' },
      { name: 'Company', description: 'Company related endpoints' },
      { name: 'Company Review', description: 'Company Review related endpoints' },
      { name: 'Job', description: 'Job related endpoints' },
    ],
    servers: [
      {
        url: 'http://localhost:3000', // 로컬 서버 URL
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT', // JWT 형식의 Bearer Token 사용
        },
      },
      schemas: {
        ApplicationStats: {
          type: 'object',
          properties: {
            jobId: {
              type: 'string',
              description: '채용 공고의 ID',
            },
            totalApplications: {
              type: 'integer',
              description: '총 지원자 수',
            },
            accepted: {
              type: 'integer',
              description: '승인된 지원자 수',
            },
            rejected: {
              type: 'integer',
              description: '거부된 지원자 수',
            },
            pending: {
              type: 'integer',
              description: '대기 중인 지원자 수',
            },
          },
          required: ['jobId', 'totalApplications', 'accepted', 'rejected', 'pending'],
        },
        Company: {
          type: 'object',
          properties: {
            company_name: {
              type: 'string',
              description: '회사 이름',
            },
            company_type: {
              type: 'string',
              description: '회사 유형',
            },
            website: {
              type: 'string',
              description: '회사 웹사이트 URL',
            },
            address: {
              type: 'string',
              description: '회사 주소',
            },
            employee_count: {
              type: 'integer',
              description: '직원 수',
            },
            industry: {
              type: 'string',
              description: '산업 분야',
            },
            ceo_name: {
              type: 'string',
              description: 'CEO 이름',
            },
            description: {
              type: 'string',
              description: '회사 설명',
            },
            establish_date: {
              type: 'string',
              description: '설립일',
            },
            revenue: {
              type: 'number',
              description: '매출',
            },
            salary: {
              type: 'integer',
              description: '급여 수준',
            },
          },
          required: ['company_name', 'company_type', 'website', 'address'],
        },
        // CompanyReview 추가
        CompanyReview: {
          type: 'object',
          properties: {
            userId: {
              type: 'string',
              description: '리뷰를 작성한 사용자 ID',
            },
            companyId: {
              type: 'string',
              description: '리뷰 대상 회사 ID',
            },
            rating: {
              type: 'integer',
              description: '평점 (1-5)',
              minimum: 1,
              maximum: 5,
            },
            reviewText: {
              type: 'string',
              description: '리뷰 내용',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: '리뷰 작성 시간',
            },
          },
          required: ['userId', 'companyId', 'rating', 'reviewText'],
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
