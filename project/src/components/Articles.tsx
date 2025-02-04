import Image from "next/image"
import Link from "next/link"


interface Article {
    id: string
    title: string
    author: string
    date: string
    excerpt: string
    content: string
    imageUrl: string
}


interface ArticleProps {
    article: Article
}

export const mockArticles: Article[] = [
    {
      id: "1",
      title: "Sample Article Title",
      author: "Jayne Baran",
      date: "2025-01-15",
      excerpt:
        "A deep dive into how we take care of our cats, Scram and Roni",
      content: `
        Lorem ipsum odor amet, consectetuer adipiscing elit. Velit orci morbi pharetra sem, consequat lobortis convallis. Natoque in fringilla, lacinia mattis erat leo. Sapien per pulvinar scelerisque lobortis ligula. Ullamcorper vestibulum libero pulvinar netus inceptos nibh dignissim. Ad diam rhoncus egestas potenti per nisi sodales. Justo mollis natoque varius dis pharetra nam facilisi malesuada phasellus. Malesuada platea pretium eros pellentesque aliquam rutrum nibh semper.

        Metus pretium turpis sapien scelerisque dui sapien? Vulputate nisi aliquam varius montes ut et tortor. Nunc amet tellus eu natoque integer vestibulum penatibus. Eu dolor ut aenean dolor penatibus. Suspendisse purus pulvinar posuere amet porta dolor fames felis. Viverra lectus ipsum primis praesent gravida vulputate fames habitasse. Varius sociosqu tincidunt a accumsan primis aenean nunc sit. Vulputate augue egestas; magna dapibus nisi vel.

        Mus ad ipsum quam per commodo placerat consectetur quis. Sapien augue cursus id lobortis cursus adipiscing ultricies pharetra senectus. Justo turpis erat ad leo pulvinar. Mauris dolor suspendisse mauris senectus id suspendisse. Venenatis eros nam libero augue phasellus. Turpis eu arcu sapien fusce, elit vitae aliquet? Dictum eleifend proin, efficitur curabitur neque diam. Nunc taciti auctor tristique ridiculus, orci volutpat mattis. Augue fusce sed purus lectus adipiscing.

        Eu eu fringilla gravida habitasse nisi at facilisis pellentesque imperdiet? Pharetra metus parturient phasellus; parturient ultrices nulla convallis. Non netus natoque nunc finibus varius euismod. Sem eros praesent, sit orci vitae massa. Facilisi integer lobortis lacus taciti platea viverra, vivamus felis. Feugiat aliquet laoreet diam euismod quis ligula dui. Quis phasellus pellentesque aliquet ipsum nullam! Rutrum morbi accumsan quisque purus amet tristique parturient. Fringilla etiam lacinia auctor ex morbi velit curabitur. Nascetur sit platea dignissim condimentum senectus feugiat nec dui.

        Penatibus tortor ligula quis imperdiet aptent id. Convallis ut netus massa volutpat sem lorem. Dis nulla suscipit tempus commodo cursus rhoncus ad a. Ullamcorper ad lobortis nullam posuere molestie gravida interdum. Magna feugiat cubilia eros per aliquam enim risus. Leo semper condimentum netus fringilla vehicula condimentum pellentesque semper? Purus per pellentesque ultrices sagittis inceptos ac et. Felis mattis accumsan; condimentum nulla ridiculus lectus. Dis mi nisi dui pharetra; eleifend luctus.

        Tortor fringilla est vulputate egestas, placerat donec. Sagittis rhoncus ligula congue, sagittis vitae augue. Praesent at lobortis porta aenean eleifend nibh. Lorem et montes urna hendrerit, mus scelerisque. Tellus luctus montes sem vivamus lobortis porttitor facilisis. Nibh platea nunc odio aliquam risus ornare. Etiam congue sed tristique cras arcu penatibus posuere? Vivamus facilisis risus consectetur consequat maecenas vehicula.

        Praesent elit turpis vivamus sed sagittis. Dapibus eu luctus praesent maecenas, nunc porta nullam. Ligula sodales blandit nisi praesent egestas etiam luctus phasellus. Phasellus ultricies malesuada lectus cras est vehicula. Semper curabitur lacus vestibulum elementum quis eleifend. Duis molestie curabitur venenatis auctor nulla bibendum. Aptent amet nullam, curae mus facilisi consectetur volutpat venenatis. Efficitur donec amet enim fermentum facilisis in non cursus quam. Venenatis commodo dignissim vitae fringilla mus inceptos.

        Consectetur faucibus viverra fringilla aliquam, laoreet diam netus varius dis. Tempor nisi efficitur interdum fermentum pellentesque! Luctus venenatis eget interdum lacus dictum senectus sem. Curabitur maecenas sollicitudin nascetur egestas curabitur sociosqu commodo posuere. Class orci ex suscipit, pretium at nisl. Nam nec himenaeos varius lobortis morbi congue. Torquent quis natoque habitasse in habitasse. Tincidunt nullam venenatis morbi iaculis urna nisi sit. Taciti metus himenaeos fusce himenaeos eu turpis litora enim condimentum.

        Hendrerit donec aliquet non convallis consequat. Malesuada proin neque tempor tempor tempor vestibulum. Laoreet eu enim quis cubilia sed eleifend mollis erat elementum. Mattis nunc ultricies aliquet litora dictum sollicitudin. Potenti rutrum blandit maecenas; molestie neque parturient. Accumsan molestie volutpat nam ornare ac. Augue velit elit quis primis phasellus mattis class. Nunc parturient elementum bibendum bibendum condimentum duis euismod nam.

        Id senectus potenti fusce nec maecenas turpis. Ornare eros in bibendum senectus; hac tempus curabitur lacinia tempor. Ligula est dictum auctor amet; adipiscing ipsum facilisi efficitur. Ex malesuada cubilia enim congue libero finibus nascetur. Ac viverra erat diam laoreet metus. Netus ac egestas tortor mattis tempor fermentum. Suscipit felis elementum, felis turpis vel purus. Urna fringilla aenean mi nullam tellus dictum suspendisse a sapien. Urna magna vel faucibus cras et sollicitudin dui faucibus?
      `,
      imageUrl: "/placeholder.svg?height=400&width=600",
    },
    {
      id: "2",
      title: "Sample Article Title",
      author: "Coop Baran",
      date: "2025-02-01",
      excerpt: "A deep dive into how to assemble the perfect deli sandwich.",
      content: `
          Lorem ipsum odor amet, consectetuer adipiscing elit. Velit orci morbi pharetra sem, consequat lobortis convallis. Natoque in fringilla, lacinia mattis erat leo. Sapien per pulvinar scelerisque lobortis ligula. Ullamcorper vestibulum libero pulvinar netus inceptos nibh dignissim. Ad diam rhoncus egestas potenti per nisi sodales. Justo mollis natoque varius dis pharetra nam facilisi malesuada phasellus. Malesuada platea pretium eros pellentesque aliquam rutrum nibh semper.

          Metus pretium turpis sapien scelerisque dui sapien? Vulputate nisi aliquam varius montes ut et tortor. Nunc amet tellus eu natoque integer vestibulum penatibus. Eu dolor ut aenean dolor penatibus. Suspendisse purus pulvinar posuere amet porta dolor fames felis. Viverra lectus ipsum primis praesent gravida vulputate fames habitasse. Varius sociosqu tincidunt a accumsan primis aenean nunc sit. Vulputate augue egestas; magna dapibus nisi vel.

          Mus ad ipsum quam per commodo placerat consectetur quis. Sapien augue cursus id lobortis cursus adipiscing ultricies pharetra senectus. Justo turpis erat ad leo pulvinar. Mauris dolor suspendisse mauris senectus id suspendisse. Venenatis eros nam libero augue phasellus. Turpis eu arcu sapien fusce, elit vitae aliquet? Dictum eleifend proin, efficitur curabitur neque diam. Nunc taciti auctor tristique ridiculus, orci volutpat mattis. Augue fusce sed purus lectus adipiscing.

          Eu eu fringilla gravida habitasse nisi at facilisis pellentesque imperdiet? Pharetra metus parturient phasellus; parturient ultrices nulla convallis. Non netus natoque nunc finibus varius euismod. Sem eros praesent, sit orci vitae massa. Facilisi integer lobortis lacus taciti platea viverra, vivamus felis. Feugiat aliquet laoreet diam euismod quis ligula dui. Quis phasellus pellentesque aliquet ipsum nullam! Rutrum morbi accumsan quisque purus amet tristique parturient. Fringilla etiam lacinia auctor ex morbi velit curabitur. Nascetur sit platea dignissim condimentum senectus feugiat nec dui.

          Penatibus tortor ligula quis imperdiet aptent id. Convallis ut netus massa volutpat sem lorem. Dis nulla suscipit tempus commodo cursus rhoncus ad a. Ullamcorper ad lobortis nullam posuere molestie gravida interdum. Magna feugiat cubilia eros per aliquam enim risus. Leo semper condimentum netus fringilla vehicula condimentum pellentesque semper? Purus per pellentesque ultrices sagittis inceptos ac et. Felis mattis accumsan; condimentum nulla ridiculus lectus. Dis mi nisi dui pharetra; eleifend luctus.

          Tortor fringilla est vulputate egestas, placerat donec. Sagittis rhoncus ligula congue, sagittis vitae augue. Praesent at lobortis porta aenean eleifend nibh. Lorem et montes urna hendrerit, mus scelerisque. Tellus luctus montes sem vivamus lobortis porttitor facilisis. Nibh platea nunc odio aliquam risus ornare. Etiam congue sed tristique cras arcu penatibus posuere? Vivamus facilisis risus consectetur consequat maecenas vehicula.

          Praesent elit turpis vivamus sed sagittis. Dapibus eu luctus praesent maecenas, nunc porta nullam. Ligula sodales blandit nisi praesent egestas etiam luctus phasellus. Phasellus ultricies malesuada lectus cras est vehicula. Semper curabitur lacus vestibulum elementum quis eleifend. Duis molestie curabitur venenatis auctor nulla bibendum. Aptent amet nullam, curae mus facilisi consectetur volutpat venenatis. Efficitur donec amet enim fermentum facilisis in non cursus quam. Venenatis commodo dignissim vitae fringilla mus inceptos.

          Consectetur faucibus viverra fringilla aliquam, laoreet diam netus varius dis. Tempor nisi efficitur interdum fermentum pellentesque! Luctus venenatis eget interdum lacus dictum senectus sem. Curabitur maecenas sollicitudin nascetur egestas curabitur sociosqu commodo posuere. Class orci ex suscipit, pretium at nisl. Nam nec himenaeos varius lobortis morbi congue. Torquent quis natoque habitasse in habitasse. Tincidunt nullam venenatis morbi iaculis urna nisi sit. Taciti metus himenaeos fusce himenaeos eu turpis litora enim condimentum.

          Hendrerit donec aliquet non convallis consequat. Malesuada proin neque tempor tempor tempor vestibulum. Laoreet eu enim quis cubilia sed eleifend mollis erat elementum. Mattis nunc ultricies aliquet litora dictum sollicitudin. Potenti rutrum blandit maecenas; molestie neque parturient. Accumsan molestie volutpat nam ornare ac. Augue velit elit quis primis phasellus mattis class. Nunc parturient elementum bibendum bibendum condimentum duis euismod nam.

          Id senectus potenti fusce nec maecenas turpis. Ornare eros in bibendum senectus; hac tempus curabitur lacinia tempor. Ligula est dictum auctor amet; adipiscing ipsum facilisi efficitur. Ex malesuada cubilia enim congue libero finibus nascetur. Ac viverra erat diam laoreet metus. Netus ac egestas tortor mattis tempor fermentum. Suscipit felis elementum, felis turpis vel purus. Urna fringilla aenean mi nullam tellus dictum suspendisse a sapien. Urna magna vel faucibus cras et sollicitudin dui faucibus?
      `,
      imageUrl: "/placeholder.svg?height=400&width=600",
    },
  ]

export function ArticlePreview({ article }: ArticleProps) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <Image
          src={article.imageUrl || "/placeholder.svg"}
          alt={article.title}
          width={600}
          height={400}
          className="w-full h-48 object-cover"
        />
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-2 text-pink-600">{article.title}</h2>
          <p className="text-black mb-4">
            By {article.author} | {new Date(article.date).toLocaleDateString()}
          </p>
          <p className="text-gray-700 mb-4">{article.excerpt}</p>
          <Link
            href={`/articles/${article.id}`}
            className="inline-block bg-pink-500 text-white py-2 px-4 rounded hover:bg-pink-600 transition-colors"
          >
            Read More
          </Link>
        </div>
      </div>
    )
  }
  
export function Article({ article }: ArticleProps) {
    return (
        <article className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <Image
            src={article.imageUrl || "/placeholder.svg"}
            alt={article.title}
            width={800}
            height={400}
            className="w-full h-64 object-cover"
        />
        <div className="p-8">
            <h1 className="text-4xl font-bold mb-4 text-pink-600">{article.title}</h1>
            <p className="text-gray-600 mb-6">
            By {article.author} | {new Date(article.date).toLocaleDateString()}
            </p>
            <div className="prose prose-pink max-w-none">
              {article.content.split('\n').map((line, index) => 
                <p key={index} className="mb-4 text-black">{line}</p>
              )}
            </div>
        </div>
        </article>
    )
}
  
  