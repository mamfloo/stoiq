export default interface CommentDto {
    postId: string,
    postTime: Date,
    text: string,
    author: {
        profilePic: string,
        username: string
    }
}