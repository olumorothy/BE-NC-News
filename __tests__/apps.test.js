const app = require("../apps.js");
require("jest-sorted");
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

describe("5. GET /api/articles", () => {
  test("status:200, returns all the articles sorted by date in descending order by default", () => {
    return request(app)
      .get(`/api/articles`)
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeInstanceOf(Array);
        expect(articles).toHaveLength(12);
        expect(articles).toBeSortedBy("created_at", { descending: true });
        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
            })
          );
        });
      });
  });
  test("status:200, accepts a topic as a query and returns articles of only that topic", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles[0]).toEqual(
          expect.objectContaining({
            article_id: 5,
            title: "UNCOVERED: catspiracy to bring down democracy",
            author: "rogersop",
            created_at: "2020-08-03T13:14:00.000Z",
            body: "Bastet walks amongst us, and the cats are taking arms!",
            votes: 0,
            topic: "cats",
            comment_count: 2,
          })
        );
      });
  });
  test("status:200, articles are sorted by date in descending order by default", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("Responds with status 400 if given an invalid topic", () => {
    return request(app)
      .get("/api/articles?topic=calendar")
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Invalid Topic");
      });
  });
  test("Responds with status 400 if given an invalid sort category", () => {
    return request(app)
      .get("/api/articles?sort_by=size")
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Invalid sort value");
      });
  });
  test("Responds with status 200 if given a valid topic with no related articles", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(0);
      });
  });
});

describe("6.  GET /api/articles/:article_id/comments", () => {
  test("status:200, responds with an array of comments for the given id with the most recent first", () => {
    return request(app)
      .get("/api/articles/9/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toBeInstanceOf(Array);
        expect(comments).toHaveLength(2);
        comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              author: expect.any(String),
              body: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
            })
          );
          expect(comments).toBeSortedBy("created_at", { descending: true });
        });
      });
  });
  test("status:404, responds with not found error if id is valid but not found ", () => {
    return request(app)
      .get("/api/articles/900/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe("Not found!");
      });
  });
  test("status:400, responds with bad request if an invalid id is sent", () => {
    return request(app)
      .get("/api/articles/banana/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Bad request");
      });
  });
});

describe("7 POST /api/articles/:article_id/comments", () => {
  test("status:201, responds with the newly posted comments", () => {
    const newComment = {
      username: "butter_bridge",
      body: "I hope its worth the hype",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toEqual(
          expect.objectContaining({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
          })
        );
      });
  });
  test("status:400,Bad request when an empty/missing data is sent", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ username: "butter_bridge" })
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Bad request");
      });
  });
  test("status:400, Bad request when an invalid article id is provided", () => {
    const newComment = {
      username: "butter_bridge",
      body: "I hope its worth the hype",
    };
    return request(app)
      .post("/api/articles/newarticle/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Bad request");
      });
  });
  test("status 404, responds with not found error if id is valid but not found", () => {
    const newComment = {
      username: "butter_bridge",
      body: "I hope its worth the hype",
    };
    return request(app)
      .post("/api/articles/100/comments")
      .send(newComment)
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe("Not found!");
      });
  });
});
