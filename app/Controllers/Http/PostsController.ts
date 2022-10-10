import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Application from '@ioc:Adonis/Core/Application'
import {v4 as uuidv4} from 'uuid'
import Post from 'App/Models/Post'

export default class PostsController {

    private validationOptions = {
        types: ['image'],
        size: '2mb'
    }

    public async index({response}: HttpContextContract) {
        const posts = await Post.query().preload('comments')
        response.status(200)
        return {
            data: posts
        }
    }

    public async show({params, response}: HttpContextContract) {
        const post = await Post.findOrFail(params.id)
        await post.load('comments')
        response.status(200)
        return {
            data: post
        }
    }

    public async store({request, response}: HttpContextContract){
        const body = request.body()
        const image = request.file('image', this.validationOptions)
        if(image){
            const imageName = `${uuidv4()}.${image.extname}`
            await image.move(Application.tmpPath('uploads'), {
                name: imageName
            })
            body.image = imageName
        }
        const post = await Post.create(body)
        response.status(201)
        return{
            message: "Post criado",
            data: post
        }
    }

    public async update({params, request, response}: HttpContextContract) {
        const body = request.body()
        const post = await Post.findOrFail(params.id)
        post.title = body.title
        post.description = body.description
        if(post.image != body.image || !post.image){
            const image = request.file('image', this.validationOptions)
            if(image){
                const imageName = `${uuidv4()}.${image.extname}`
                await image.move(Application.tmpPath('uploads'), {
                    name: imageName
                })
                post.image = imageName
            }
        }
        await post.save()
        response.status(200)
        return{
            message: "Post atualizado",
            data: post
        }
    }

    public async destroy({params, response}: HttpContextContract) {
        const post = await Post.findOrFail(params.id)
        await post.delete()
        response.status(204)
        return {
            message: "Post excluído",
            data: post
        }
    }
}