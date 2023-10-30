const express = require("express")
const { PostModel } = require("../model/post.model")
const postRouter = express.Router()
const { auth } = require("../middleware/auth.middleware")

postRouter.use(auth)
postRouter.post("/add", auth, async (req, res) => {

    const payload = req.body

    try {
        const post = new PostModel(payload)

        await post.save()

        res.status(200).send({ "msg": "New note has been added to the database" })

    } catch (error) {
        res.status(4000).send({ "err": error })
    }

})
postRouter.get("/", auth, async (req, res) => {
    try {
        const note = await PostModel.find({ name: req.body.name })

        res.status(200).send(note)

    } catch (error) {

        res.status(400).send({ "err": error })
    }
})



postRouter.patch("/update/:postID", auth, async (req, res) => {
    const { postID } = req.params
    const post = await PostModel.findOne({ _id: postID })
    const payload = req.body
    try {
        if (req.body.postID === post.postID) {

            await PostModel.findByIdAndUpdate({ _id: postID }, payload)
            res.status(200).send({ "msg": `The note with ID:${postID}has been  update` })
        } else {
            res.status(200).send({ "msg": "You are not authorized to update other content" })
        }

    } catch (error) {
        res.status(400).send(error)
    }
})

postRouter.delete("/delete/:postID", auth, async (req, res) => {
    const { postID } = req.params
    const post = await PostModel.findOne({ _id: postID })
    try {
        if (req.body.postID === post.postID) {
            await PostModel.findByIdAndDelete({ _id: postID })
            res.status(200).send({ "msg": `The post ID:${postID} deleted` })
        } else {
            res.status(200).send({ "msg": "you are not authorized" })
        }
    } catch (error) {
        res.status(400).send({ "err": error })
    }
})


postRouter.get('/posts', async (req, res) => {
    const page = parseInt(req.query.page) || 1

    const limiting = 3; 
  
    try {
        
      const posts = await PostModel.find()
        .skip((page - 1) * limiting)
        .limit(limiting);
  
      res.json(posts);
      
    } catch (err) {
      res.status(400).send({ "error": err.message });
    }
  })

module.exports = {
    postRouter
}