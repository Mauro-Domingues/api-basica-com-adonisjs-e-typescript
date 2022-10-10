import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Post from 'App/Models/Post'
import Comment from 'App/Models/Comment'

export default class CommentsController {
    public async store({request, response, params}: HttpContextContract){
        const body = request.body()
        const post_id = params.post_id
        await Post.findOrFail(post_id)
        body.post_id = post_id
        const comment = await Comment.create(body)
        response.status(201)
        return {
            message: "Comentário adicionado",
            data: comment
        }
    }
}
