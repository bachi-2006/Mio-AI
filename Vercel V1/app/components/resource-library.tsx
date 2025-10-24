import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const resources = [
  { id: 1, title: "Introduction to Computer Science", type: "Course", link: "#" },
  { id: 2, title: "Data Structures and Algorithms", type: "Book", link: "#" },
  { id: 3, title: "Machine Learning Basics", type: "Video", link: "#" },
  { id: 4, title: "Web Development Fundamentals", type: "Tutorial", link: "#" },
  { id: 5, title: "Python Programming", type: "Course", link: "#" },
]

export function ResourceLibrary() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Resource Library</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {resources.map((resource) => (
            <li key={resource.id} className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{resource.title}</h3>
                <p className="text-sm text-gray-500">{resource.type}</p>
              </div>
              <Button variant="outline" asChild>
                <a href={resource.link} target="_blank" rel="noopener noreferrer">
                  Access
                </a>
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
