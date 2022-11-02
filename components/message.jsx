function Message({  post, children }) {
  /* 
1 - description: "hello world"
2 - timestamp: nt {seconds: 1665815374, nanoseconds: 998000000}
3 - user: "1Y5VBnw4v0V0y9zJvKIN0Zr5zVv2"
4 - userImage: "https://lh3.googleusercontent.com/a/ALm5wu3r8AJS0Tg6EEhBHgmiY-FU6XTpwy1FVjOGPFDNQA=s96-c"
5 - username: "Hassan _397"
6 - id: "Hbc9XmggbSDacbRsgvdT"
*/

return (
  <section className="bg-white p-4 my-4 border-2 rounded-lg flex flex-col items-start justify-start gap-2 shadow-xl">
      <div className="flex items-center gap-4">
        <img className="rounded-3xl w-14 text-sm" src={post.userImage} alt="user photo" />
        <h2 className="text-xl">{post.username}</h2>
      </div>
      <div className="p-4">
        <p className="font-bold">{post.description}</p>
      </div>
      {children}
    </section>
  );
}

export default Message;