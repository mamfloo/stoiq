export default interface LikeDto {
    referenceId: string,  //post or comment
    likeTime: Date,
    author: {
        profilePic: string,
        username: string
    }
}