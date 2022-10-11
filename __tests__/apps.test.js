const app = require("../apps.js");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");

beforeEach(() => {
  //seeding the db with the test data
  return seed(testData);
});
afterAll(() => {
  return db.end();
});

describe("1. Get /api/topics", () => {
  test("status:200, responds with an array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics).toBeInstanceOf(Array);
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
  test("status :404 , get api/topicss, not found ", () => {
    return request(app)
      .get("/api/topicss")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
});
describe("2. GET /api/articles/:article_id", () => {
  test("status:200 ,responds with an article object with thier properties", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;

        expect(article).toBeInstanceOf(Object);
        expect(article).toEqual(
          expect.objectContaining({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
          })
        );
      });
  });
  test("status:400, bad request if id is invalid", () => {
    return request(app)
      .get("/api/articles/elephant")
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Bad request");
      });
  });
  test("status:404, bad request if id is invalid", () => {
    return request(app)
      .get("/api/articles/700")
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe("Not found!");
      });
  });
  test("status:200, returns an object with an array of articles with comment_count added", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toBeInstanceOf(Object);
        expect(article).toEqual(
          expect.objectContaining({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(Number),
          })
        );
        expect(body.article.comment_count).toBe(11);
      });
  });
});
describe("3. GET /api/users", () => {
  test("status:200, returns an array of user objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users).toBeInstanceOf(Array);
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });

  test("status :404 , get api/user, not found ", () => {
    return request(app)
      .get("/api/user")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
});

describe("4. PATCH /api/articles/:article_id", () => {
  test("status 200, updates article by id and accepts a newVote value ", () => {
    const id = 1;
    const updateArticle = { inc_votes: -3 };

    return request(app)
      .patch(`/api/articles/${id}`)
      .send(updateArticle)
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 97,
        });
        expect(body.articles.votes).toBe(97);
      });
  });
  test("status:404, bad request if id is valid but not found", () => {
    const updateArticle = { inc_votes: 7 };
    return request(app)
      .patch("/api/articles/700")
      .send(updateArticle)
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe("Not found!");
      });
  });
  test("status: 400, bad request if an empty object is sent ", () => {
    const updateArticle = {};
    return request(app)
      .patch(`/api/articles/1`)
      .send(updateArticle)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad request,no value to update");
      });
  });
  test("status: 400, bad request does not contain valid inc_votes data type", () => {
    const updateArticle = { inc_votes: "somethingelse" };
    return request(app)
      .patch(`/api/articles/1`)
      .send(updateArticle)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad request");
      });
  });

  test("status: 400, invalid/bad path", () => {
    return request(app)
      .patch(`/api/articles/banana`)
      .send({ inc_votes: 5 })
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad request");
      });
  });
});
