### Steps To Follow

* `git clone https://github.com/airbornharsh/movie-db-backend`
* `cp .env.example.com .env`
* Add your DATABASE_URL and JWT_SECRET
* `yarn`
* `yarn prisma migrate dev && npx prisma generate`
* `yarn dev`

Server will be live at [PORT:3000](http://localhost:3000)

POSTMAN (For Testing) - https://speeding-shadow-300529.postman.co/workspace/Public~68cf190e-f364-40ed-942f-2bf71e7bb897/collection/21798391-223ff08b-7d08-4d12-be3b-88cdbc495ceb?action=share&creator=21798391
