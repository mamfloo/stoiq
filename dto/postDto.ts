export default interface PostDto {
    text: string,
    postTime: Date,
    nLikes: number,
    nComments: number,
    author: {
        profilePic: string,
        username: string
    }
}