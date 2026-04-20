import type {
  CourseInfo,
  CourseMaterial,
  PiazzaPost,
  TrendingTopic,
  InstructorStatus,
  AvailabilitySlot,
  InstructorRequest,
} from "./types"

export const courseInfo: CourseInfo = {
  id: "cs101-sp26",
  name: "CS 101: Introduction to Computer Science",
  term: "Spring 2026",
  instructor: "Prof. Sarah Chen",
  description:
    "Fundamentals of programming, data structures, and algorithmic thinking using Python.",
}

export const courseMaterials: CourseMaterial[] = [
  {
    id: "mat-1",
    title: "Course Syllabus",
    type: "syllabus",
    week: 0,
    visible: true,
    content: `CS 101 - Introduction to Computer Science
Spring 2026 | Prof. Sarah Chen
Office Hours: Mon/Wed 2-4pm, Thu 10-12pm

Course Objectives:
- Understand fundamental programming concepts (variables, control flow, functions)
- Learn basic data structures (lists, dictionaries, stacks, queues, linked lists)
- Develop algorithmic thinking and problem-solving skills
- Write clean, well-documented Python code

Grading:
- Homework Assignments (40%) - 8 assignments, lowest dropped
- Midterm Exam (20%) - Week 8
- Final Project (25%) - Due finals week
- Participation & Piazza (15%) - Active engagement expected

Late Policy: 10% per day, max 3 days late. No extensions without prior approval.
Academic Integrity: All work must be your own. Collaboration on concepts is encouraged, but sharing code is prohibited.`,
  },
  {
    id: "mat-2",
    title: "Week 1: Variables & Data Types",
    type: "lecture_notes",
    week: 1,
    visible: true,
    content: `Variables & Data Types in Python

Key Concepts:
- Variables are names that refer to values in memory
- Python is dynamically typed - no need to declare types explicitly
- Basic types: int, float, str, bool
- Type conversion: int(), float(), str(), bool()
- String operations: concatenation (+), repetition (*), slicing [start:end]
- f-strings for formatting: f"Hello {name}, you are {age} years old"



Common Pitfalls:
- Integer division: 7 / 2 = 3.5, 7 // 2 = 3
- Mutable vs immutable: strings are immutable, lists are mutable
- Variable naming: use snake_case, avoid reserved words`,
  },
  {
    id: "mat-3",
    title: "Week 2: Control Flow & Loops",
    type: "lecture_notes",
    week: 2,
    visible: true,
    content: `Control Flow & Loops

If/Elif/Else:
- Conditions evaluate to True or False
- Indentation defines blocks (4 spaces standard)
- Chaining conditions with and, or, not

For Loops:
- Iterate over sequences: for item in list
- range(start, stop, step) for numeric iteration
- enumerate() for index + value pairs
- List comprehensions: [x**2 for x in range(10) if x % 2 == 0]

While Loops:
- Continue until condition is False
- break to exit early, continue to skip iteration
- Be careful of infinite loops!

Nested Loops:
- Time complexity considerations: $O(n)$ vs $O(n^2)$
- When to use nested loops vs other approaches`,
  },
  {
    id: "mat-4",
    title: "Week 3: Functions & Scope",
    type: "lecture_notes",
    week: 3,
    visible: true,
    content: `Functions & Scope

Defining Functions:
- def function_name(parameters): return value
- Docstrings: """Description of what the function does"""
- Default parameters: def greet(name, greeting="Hello")
- *args for variable positional arguments, **kwargs for keyword arguments

Scope Rules (LEGB):
- Local: inside the current function
- Enclosing: in the enclosing function (closures)
- Global: at the module level
- Built-in: Python's built-in names

Return Values:
- Functions return None by default
- Can return multiple values as tuples
- Early return for guard clauses

Best Practices:
- Single responsibility principle
- Meaningful names: calculate_average vs calc
- Keep functions short (< 20 lines ideally)`,
  },
  {
    id: "mat-5",
    title: "Week 4: Recursion",
    type: "lecture_notes",
    week: 4,
    visible: true,
    content: `Recursion

What is Recursion?
- A function that calls itself to solve smaller subproblems
- Every recursive function needs: base case + recursive case
- The call stack: each call creates a new stack frame



Classic Examples:
- Factorial: n! = n * (n-1)!  Base case: 0! = 1
- Fibonacci: fib(n) = fib(n-1) + fib(n-2)  Base cases: fib(0)=0, fib(1)=1
- Binary search: divide search space in half each time

Common Mistakes:
- Missing or wrong base case leads to infinite recursion
- RecursionError: Python limits to ~1000 recursive calls by default
- Not reducing the problem size in recursive call

Recursion vs Iteration:
- Any recursive solution can be written iteratively
- Recursion is more elegant for tree/divide-and-conquer problems
- Iteration is usually more memory-efficient (no stack frames)`,
  },
  {
    id: "mat-6",
    title: "Homework 3: Recursion & Functions",
    type: "assignment",
    week: 4,
    visible: true,
    content: `Homework 3: Recursion & Functions
Due: Week 5, Friday 11:59 PM

Problem 1: Write a recursive function power(base, exp) that computes base^exp without using ** operator.
Problem 2: Write a recursive function palindrome(s) that checks if a string is a palindrome.
Problem 3: Write a recursive function flatten(nested_list) that flattens arbitrarily nested lists.
Problem 4: Write a function that uses recursion to compute the sum of digits of a positive integer.

Submission: Upload to Gradescope. Include docstrings and test cases for each function.`,
  },
  {
    id: "mat-7",
    title: "Week 5: Lists & Data Structures",
    type: "lecture_notes",
    week: 5,
    visible: true,
    content: `Lists & Basic Data Structures

Lists:
- Ordered, mutable sequences: [1, 2, 3]
- Indexing: lst[0], lst[-1]
- Slicing: lst[1:3], lst[::2]
- Methods: append, extend, insert, remove, pop, sort, reverse
- List comprehensions for concise creation

Tuples:
- Ordered, immutable sequences: (1, 2, 3)
- Useful for returning multiple values
- Can be used as dictionary keys (unlike lists)

Dictionaries:
- Key-value pairs: {"name": "Alice", "age": 20}
- $O(1)$ average lookup time
- Methods: keys(), values(), items(), get()
- Dictionary comprehensions



Sets:
- Unordered collection of unique elements
- Operations: union, intersection, difference
- $O(1)$ membership testing`,
  },
  {
    id: "mat-8",
    title: "Midterm Exam Study Guide",
    type: "resource",
    week: 7,
    visible: false,
    content: `MIDTERM EXAM STUDY GUIDE - INSTRUCTOR ONLY
Topics: Weeks 1-6
Focus areas: recursion tracing (30%), function writing (25%), data structures (25%), debugging (20%)
Exam format: 3 coding questions, 2 tracing questions, 5 short answer
Key problems students struggle with: recursion base cases, list aliasing vs copying, scope rules`,
  },
  {
    id: "mat-9",
    title: "Grading Rubric - HW3",
    type: "resource",
    week: 5,
    visible: false,
    content: `HW3 GRADING RUBRIC - INSTRUCTOR/TA ONLY
Problem 1 (25 pts): Correct recursion 15pts, base case 5pts, docstring 5pts
Problem 2 (25 pts): Correct logic 15pts, edge cases (empty string, single char) 5pts, docstring 5pts
Problem 3 (30 pts): Handles nested lists 15pts, handles mixed types 10pts, docstring 5pts
Problem 4 (20 pts): Correct recursion 10pts, handles edge cases 5pts, docstring 5pts
Common deductions: -5 for no docstrings, -10 for using iteration instead of recursion`,
  },
  {
    id: "mat-10",
    title: "Week 6: File I/O & Exceptions",
    type: "lecture_notes",
    week: 6,
    visible: true,
    content: `File Input/Output & Exception Handling

Reading and Writing Files:
- Always use context managers: \`with open('data.txt', 'r') as file:\`
- Modes: 'r' (read), 'w' (write), 'a' (append)
- Reading: \`read()\`, \`readlines()\`, iterating over the file object
- Writing: \`write()\`, \`writelines()\`

Exception Handling:
- Try/Except blocks prevent crashes
- Catch specific errors: \`except FileNotFoundError:\`
- The \`finally\` block always executes (good for cleanup)
- Raising custom exceptions: \`raise ValueError("Invalid input")\`

Common Pitfalls:
- Forgetting that file paths are relative to where the script is executed
- Not converting string inputs from files into integers/floats before doing math`,
  },
  {
    id: "mat-11",
    title: "Week 8: Object-Oriented Programming (Classes)",
    type: "lecture_notes",
    week: 8,
    visible: true,
    content: `Object-Oriented Programming: Part 1

Classes vs. Instances:
- Class: A blueprint (e.g., \`class Dog:\`)
- Instance: A specific object built from the blueprint (e.g., \`fido = Dog()\`)

The \`__init__\` Method:
- The constructor method called when an object is created.
- Used to set up initial instance attributes.

The \`self\` Parameter:
- Refers to the specific instance calling the method.
- MUST be the first parameter in all instance methods.
- Use \`self.attribute_name\` to access object data.

`,
  },
  {
    id: "mat-12",
    title: "Week 10: Searching & Sorting Algorithms",
    type: "lecture_notes",
    week: 10,
    visible: true,
    content: `Algorithms: Searching & Sorting

Searching:
- Linear Search: $O(n)$ time. Check each element one by one.
- Binary Search: $O(\log n)$ time. Requires a sorted list. Checks the middle, halves search space.

Sorting basics:
- Bubble Sort: $O(n^2)$. Swap adjacent elements until sorted.
- Merge Sort: $O(n \log n)$. Divide and conquer recursive algorithm.
- Python's built-in \`sort()\` uses Timsort ($O(n \log n)$).

`,
  },
  {
    id: "mat-13",
    title: "Final Project Guidelines",
    type: "assignment",
    week: 12,
    visible: true,
    content: `CS101 Final Project
Due: Finals Week, Wednesday 11:59 PM

Objective: Build a command-line application that demonstrates your mastery of Python.
Requirements:
1. Must use at least two Custom Classes.
2. Must read from and write to a JSON or CSV file.
3. Must include error handling (try/except blocks).
4. Must process a collection of data using algorithms (sorting/searching).

Team Size: 1-3 students.
Deliverables: Codebase (.py files), requirements.txt, and a 3-page PDF design document detailing your architectural choices.`,
  }
]

export const piazzaPosts: PiazzaPost[] = [
  {
    id: "post-1",
    number: 1,
    type: "note",
    title: "Welcome to CS 101! Read this first.",
    content:
      "Welcome to CS 101! Please read the syllabus carefully and introduce yourself in the followups below. Remember to use Piazza for all course-related questions -- your classmates and TAs are here to help!",
    created: "2026-01-12T09:00:00Z",
    author: { name: "Prof. Chen", role: "instructor" },
    tags: ["logistics", "welcome"],
    folders: ["logistics"],
    status: "open",
    visibility: "entire_class",
    viewCount: 312,
    followupCount: 2,
    studentAnswer: undefined,
    instructorAnswer: undefined,
    followups: [
      {
        id: "f1-1",
        content: "Hi everyone! I'm excited for this class. I've done a little Python on my own but this is my first formal CS course.",
        author: { name: "Alex Kim", role: "student" },
        created: "2026-01-12T10:30:00Z",
        replies: [],
      },
      {
        id: "f1-2",
        content: "Welcome Alex! Feel free to ask questions anytime. No question is too basic here.",
        author: { name: "TA Maria", role: "ta" },
        created: "2026-01-12T11:00:00Z",
        replies: [],
      },
    ],
    isInstructorEndorsed: false,
  },
  {
    id: "post-2",
    number: 2,
    type: "question",
    title: "Difference between = and == in Python?",
    content:
      "I keep getting errors when I write things like `if x = 5:`. Can someone explain what's going wrong? I thought = means equals.",
    created: "2026-01-15T14:22:00Z",
    author: { name: "Jordan Lee", role: "student" },
    tags: ["variables", "operators", "week1"],
    folders: ["general"],
    status: "answered",
    visibility: "entire_class",
    viewCount: 187,
    followupCount: 1,
    studentAnswer: {
      content:
        "Great question! In Python, `=` is the **assignment operator** -- it assigns a value to a variable. So `x = 5` means 'store 5 in x'. The `==` is the **comparison operator** -- it checks if two values are equal and returns True or False. So in an if statement, you need `if x == 5:` because you're *comparing*, not assigning.",
      author: { name: "Priya Patel", role: "student" },
      created: "2026-01-15T14:45:00Z",
      isEndorsed: true,
    },
    instructorAnswer: undefined,
    followups: [
      {
        id: "f2-1",
        content: "Thanks Priya! That makes sense now. So = is like putting something in a box and == is checking what's in the box?",
        author: { name: "Jordan Lee", role: "student" },
        created: "2026-01-15T15:00:00Z",
        replies: [
          {
            id: "f2-1-1",
            content: "Exactly! That's a great mental model.",
            author: { name: "Priya Patel", role: "student" },
            created: "2026-01-15T15:10:00Z",
            replies: [],
          },
        ],
      },
    ],
    isInstructorEndorsed: true,
  },
  {
    id: "post-3",
    number: 3,
    type: "question",
    title: "Why does my for loop print one extra line?",
    content: `I'm trying to print numbers 1 to 5 but I'm getting an extra line. Here's my code:

\`\`\`python
for i in range(1, 6):
    print(i)
    print()
\`\`\`

It prints each number but with a blank line after each one. How do I fix this?`,
    created: "2026-01-22T16:30:00Z",
    author: { name: "Sam Torres", role: "student" },
    tags: ["loops", "debugging", "week2"],
    folders: ["general"],
    status: "answered",
    visibility: "entire_class",
    viewCount: 94,
    followupCount: 0,
    studentAnswer: {
      content:
        "The issue is the extra `print()` call inside your loop. The `print()` with no arguments prints an empty line. Remove that second print statement and you'll get the output you want:\n```python\nfor i in range(1, 6):\n    print(i)\n```",
      author: { name: "TA Maria", role: "ta" },
      created: "2026-01-22T16:45:00Z",
      isEndorsed: false,
    },
    instructorAnswer: undefined,
    followups: [],
    isInstructorEndorsed: false,
  },
  {
    id: "post-4",
    number: 4,
    type: "question",
    title: "How does range() work with negative step?",
    content:
      "I want to count backwards from 10 to 1. I tried `range(10, 1)` but it gives me nothing. What am I doing wrong?",
    created: "2026-01-23T11:15:00Z",
    author: { name: "Mia Chen", role: "student" },
    tags: ["loops", "range", "week2"],
    folders: ["general"],
    status: "answered",
    visibility: "entire_class",
    viewCount: 128,
    followupCount: 1,
    studentAnswer: undefined,
    instructorAnswer: {
      content:
        "By default, `range()` has a step of +1, so it tries to count *up* from 10 to 1, which produces an empty sequence. You need to specify a negative step: `range(10, 0, -1)`. Remember: `range(start, stop, step)` -- stop is exclusive, so use 0 to include 1.",
      author: { name: "Prof. Chen", role: "instructor" },
      created: "2026-01-23T12:00:00Z",
      isEndorsed: true,
    },
    followups: [
      {
        id: "f4-1",
        content: "Is there a way to reverse a range after creating it? Like range(1, 11) but backwards?",
        author: { name: "Mia Chen", role: "student" },
        created: "2026-01-23T12:30:00Z",
        replies: [
          {
            id: "f4-1-1",
            content: "Yes! You can use `reversed(range(1, 11))` which gives you 10, 9, 8, ..., 1.",
            author: { name: "TA Maria", role: "ta" },
            created: "2026-01-23T12:45:00Z",
            replies: [],
          },
        ],
      },
    ],
    isInstructorEndorsed: false,
  },
  {
    id: "post-5",
    number: 5,
    type: "question",
    title: "Confused about function scope - variable not defined error",
    content: `I defined a variable inside a function but I can't use it outside. Why?

\`\`\`python
def set_name():
    name = "Alice"

set_name()
print(name)  # NameError: name 'name' is not defined
\`\`\`

I called the function so shouldn't name exist?`,
    created: "2026-02-03T09:45:00Z",
    author: { name: "Alex Kim", role: "student" },
    tags: ["functions", "scope", "week3"],
    folders: ["general"],
    status: "answered",
    visibility: "entire_class",
    viewCount: 156,
    followupCount: 2,
    studentAnswer: {
      content:
        "This is about **variable scope**. Variables created inside a function are **local** to that function -- they only exist while the function is running. Once the function finishes, the local variable `name` is destroyed. To use the value outside, you should **return** it:\n```python\ndef set_name():\n    name = \"Alice\"\n    return name\n\nresult = set_name()\nprint(result)  # prints Alice\n```",
      author: { name: "Priya Patel", role: "student" },
      created: "2026-02-03T10:15:00Z",
      isEndorsed: true,
    },
    instructorAnswer: undefined,
    followups: [
      {
        id: "f5-1",
        content: "Could I also use the `global` keyword to make it work?",
        author: { name: "Alex Kim", role: "student" },
        created: "2026-02-03T10:30:00Z",
        replies: [
          {
            id: "f5-1-1",
            content: "Technically yes, but using `global` is almost always bad practice. It makes code harder to debug and reason about. Return values are the clean way to do it.",
            author: { name: "Prof. Chen", role: "instructor" },
            created: "2026-02-03T11:00:00Z",
            replies: [],
          },
        ],
      },
      {
        id: "f5-2",
        content: "This also confused me! The LEGB rule from the lecture notes really helped me understand it.",
        author: { name: "Sam Torres", role: "student" },
        created: "2026-02-03T11:30:00Z",
        replies: [],
      },
    ],
    isInstructorEndorsed: true,
  },
  {
    id: "post-6",
    number: 6,
    type: "question",
    title: "HW3 Problem 1: Can I use a loop instead of recursion?",
    content:
      "For the power function in HW3, would it be acceptable to use a while loop? I find iteration easier to think about than recursion.",
    created: "2026-02-10T20:00:00Z",
    author: { name: "Jordan Lee", role: "student" },
    tags: ["hw3", "recursion", "week4"],
    folders: ["homework"],
    status: "answered",
    visibility: "entire_class",
    viewCount: 203,
    followupCount: 1,
    studentAnswer: undefined,
    instructorAnswer: {
      content:
        "No, the assignment specifically requires recursive solutions. The goal is to practice thinking recursively. I know it feels unnatural at first, but it gets easier! Try thinking about it this way: power(base, exp) = base * power(base, exp-1). What would the base case be?",
      author: { name: "Prof. Chen", role: "instructor" },
      created: "2026-02-10T20:30:00Z",
      isEndorsed: true,
    },
    followups: [
      {
        id: "f6-1",
        content:
          "The base case would be when exp is 0, right? Because anything to the power of 0 is 1.",
        author: { name: "Jordan Lee", role: "student" },
        created: "2026-02-10T21:00:00Z",
        replies: [
          {
            id: "f6-1-1",
            content: "Exactly right! You're already thinking recursively.",
            author: { name: "Prof. Chen", role: "instructor" },
            created: "2026-02-10T21:15:00Z",
            replies: [],
          },
        ],
      },
    ],
    isInstructorEndorsed: false,
  },
  {
    id: "post-7",
    number: 7,
    type: "question",
    title: "RecursionError: maximum recursion depth exceeded",
    content: `My recursive fibonacci function crashes with a RecursionError when I try fib(1000). It works fine for small numbers like fib(10). What's happening?

\`\`\`python
def fib(n):
    if n <= 1:
        return n
    return fib(n-1) + fib(n-2)
\`\`\``,
    created: "2026-02-12T15:20:00Z",
    author: { name: "Priya Patel", role: "student" },
    tags: ["recursion", "fibonacci", "debugging", "week4"],
    folders: ["general"],
    status: "answered",
    visibility: "entire_class",
    viewCount: 178,
    followupCount: 2,
    studentAnswer: {
      content:
        "Python has a default recursion limit of about 1000 calls. Your fibonacci function has **exponential** time complexity -- fib(1000) would make an astronomical number of recursive calls (much more than 1000 levels deep). Even fib(35) takes noticeably long because it recalculates the same values over and over. You'd need **memoization** or an **iterative approach** for large n values.",
      author: { name: "TA Maria", role: "ta" },
      created: "2026-02-12T15:50:00Z",
      isEndorsed: true,
    },
    instructorAnswer: undefined,
    followups: [
      {
        id: "f7-1",
        content: "What's memoization? Is that covered in this class?",
        author: { name: "Mia Chen", role: "student" },
        created: "2026-02-12T16:00:00Z",
        replies: [
          {
            id: "f7-1-1",
            content:
              "Memoization means caching results of expensive function calls. We'll cover it briefly in Week 6. For now, just know it exists as a solution. Python has a built-in decorator @functools.lru_cache that does it for you.",
            author: { name: "TA Maria", role: "ta" },
            created: "2026-02-12T16:15:00Z",
            replies: [],
          },
        ],
      },
      {
        id: "f7-2",
        content: "I drew the recursive call tree for fib(5) and now I see why it's so slow -- so many duplicate calculations!",
        author: { name: "Sam Torres", role: "student" },
        created: "2026-02-12T17:00:00Z",
        replies: [],
      },
    ],
    isInstructorEndorsed: true,
  },
  {
    id: "post-8",
    number: 8,
    type: "note",
    title: "HW3 Deadline Extended to Monday",
    content:
      "Due to the snow day on Thursday, the HW3 deadline has been extended to Monday, Feb 17 at 11:59 PM. No further extensions will be granted.",
    created: "2026-02-13T08:00:00Z",
    author: { name: "Prof. Chen", role: "instructor" },
    tags: ["hw3", "deadline", "announcement"],
    folders: ["homework", "logistics"],
    status: "open",
    visibility: "entire_class",
    viewCount: 245,
    followupCount: 0,
    studentAnswer: undefined,
    instructorAnswer: undefined,
    followups: [],
    isInstructorEndorsed: false,
  },
  {
    id: "post-9",
    number: 9,
    type: "question",
    title: "HW3 Problem 3: How to handle deeply nested lists?",
    content:
      "For the flatten function, how do I handle lists that are nested multiple levels deep? Like [1, [2, [3, [4]]]]. My current solution only handles one level of nesting.",
    created: "2026-02-14T19:00:00Z",
    author: { name: "Sam Torres", role: "student" },
    tags: ["hw3", "recursion", "lists", "week4"],
    folders: ["homework"],
    status: "unanswered",
    visibility: "entire_class",
    viewCount: 89,
    followupCount: 1,
    studentAnswer: undefined,
    instructorAnswer: undefined,
    followups: [
      {
        id: "f9-1",
        content:
          "Think about what recursion does naturally -- it breaks problems into smaller sub-problems. What's the 'smaller sub-problem' here? Try checking whether each element is itself a list...",
        author: { name: "TA Maria", role: "ta" },
        created: "2026-02-14T19:30:00Z",
        replies: [],
      },
    ],
    isInstructorEndorsed: false,
  },
  {
    id: "post-10",
    number: 10,
    type: "question",
    title: "What's the difference between a list and a tuple?",
    content:
      "I know lists use [] and tuples use (), but when would I actually choose a tuple over a list? They seem to do the same thing.",
    created: "2026-02-20T13:00:00Z",
    author: { name: "Jordan Lee", role: "student" },
    tags: ["data-structures", "lists", "tuples", "week5"],
    folders: ["general"],
    status: "answered",
    visibility: "entire_class",
    viewCount: 112,
    followupCount: 0,
    studentAnswer: {
      content:
        "The key difference is **mutability**: lists can be changed after creation (add, remove, modify elements), while tuples cannot. Use tuples when:\n1. You want to protect data from being accidentally modified\n2. You need to use a sequence as a dictionary key (lists can't be keys)\n3. You're returning multiple values from a function\n4. The data has a fixed structure (like coordinates: (x, y))\n\nTuples are also slightly faster and use less memory than lists.",
      author: { name: "Alex Kim", role: "student" },
      created: "2026-02-20T13:45:00Z",
      isEndorsed: false,
    },
    instructorAnswer: undefined,
    followups: [],
    isInstructorEndorsed: false,
  },
  {
    id: "post-11",
    number: 11,
    type: "question",
    title: "Dictionary KeyError - how to avoid it?",
    content: `I keep getting KeyError when accessing dictionary values. How do I handle missing keys gracefully?

\`\`\`python
student = {"name": "Alice", "grade": "A"}
print(student["age"])  # KeyError: 'age'
\`\`\``,
    created: "2026-02-22T10:30:00Z",
    author: { name: "Mia Chen", role: "student" },
    tags: ["dictionaries", "debugging", "week5"],
    folders: ["general"],
    status: "answered",
    visibility: "entire_class",
    viewCount: 95,
    followupCount: 1,
    studentAnswer: undefined,
    instructorAnswer: {
      content:
        'Several approaches:\n1. Use `.get()` with a default: `student.get("age", "N/A")`\n2. Check first: `if "age" in student:`\n3. Try/except: wrap in a try block and catch KeyError\n\nI recommend `.get()` for most cases -- it\'s clean and Pythonic.',
      author: { name: "Prof. Chen", role: "instructor" },
      created: "2026-02-22T11:00:00Z",
      isEndorsed: true,
    },
    followups: [
      {
        id: "f11-1",
        content: "There's also `collections.defaultdict` which automatically creates default values. We'll see that later in the course.",
        author: { name: "TA Maria", role: "ta" },
        created: "2026-02-22T11:30:00Z",
        replies: [],
      },
    ],
    isInstructorEndorsed: false,
  },
  {
    id: "post-12",
    number: 12,
    type: "question",
    title: "Midterm study tips?",
    content:
      "The midterm is coming up in a couple weeks. Does anyone have tips for studying? What topics should I focus on?",
    created: "2026-02-25T18:00:00Z",
    author: { name: "Alex Kim", role: "student" },
    tags: ["midterm", "exam", "study"],
    folders: ["exams"],
    status: "answered",
    visibility: "entire_class",
    viewCount: 267,
    followupCount: 2,
    studentAnswer: {
      content:
        "What helped me in similar classes:\n1. Redo all homework problems without looking at your solutions\n2. Practice tracing through recursive code by hand\n3. Make sure you can write functions from scratch, not just read them\n4. Review Piazza -- a lot of common misconceptions are addressed here!",
      author: { name: "Priya Patel", role: "student" },
      created: "2026-02-25T18:30:00Z",
      isEndorsed: false,
    },
    instructorAnswer: {
      content:
        "Great advice from Priya! I'd add:\n- Focus on understanding **why** code works, not just memorizing patterns\n- Practice writing code on paper (no IDE autocomplete on the exam)\n- Review the lecture notes, especially the 'Common Pitfalls' sections\n- Come to office hours this week and next if you have questions\n\nThe exam covers Weeks 1-6. All topics are fair game.",
      author: { name: "Prof. Chen", role: "instructor" },
      created: "2026-02-25T19:00:00Z",
      isEndorsed: true,
    },
    followups: [
      {
        id: "f12-1",
        content: "Will there be a practice exam?",
        author: { name: "Sam Torres", role: "student" },
        created: "2026-02-25T19:30:00Z",
        replies: [
          {
            id: "f12-1-1",
            content:
              "Yes! I'll post a practice exam by end of this week.",
            author: { name: "Prof. Chen", role: "instructor" },
            created: "2026-02-25T20:00:00Z",
            replies: [],
          },
        ],
      },
      {
        id: "f12-2",
        content: "Is the exam open-note or closed-note?",
        author: { name: "Mia Chen", role: "student" },
        created: "2026-02-25T20:30:00Z",
        replies: [
          {
            id: "f12-2-1",
            content: "You can bring one 8.5x11 handwritten cheat sheet (both sides).",
            author: { name: "Prof. Chen", role: "instructor" },
            created: "2026-02-25T21:00:00Z",
            replies: [],
          },
        ],
      },
    ],
    isInstructorEndorsed: false,
  },
  {
    id: "post-13",
    number: 13,
    type: "question",
    title: "List aliasing vs copying - why does this happen?",
    content: `I'm confused about this behavior:

\`\`\`python
a = [1, 2, 3]
b = a
b.append(4)
print(a)  # [1, 2, 3, 4] ??? 
\`\`\`

I only appended to b, why did a change too?`,
    created: "2026-02-27T14:00:00Z",
    author: { name: "Jordan Lee", role: "student" },
    tags: ["lists", "aliasing", "debugging", "week5"],
    folders: ["general"],
    status: "answered",
    visibility: "entire_class",
    viewCount: 143,
    followupCount: 1,
    studentAnswer: undefined,
    instructorAnswer: {
      content:
        "This is one of the most common Python gotchas! When you write `b = a`, you're **not** copying the list -- you're creating a **second name** (alias) that points to the **same list object** in memory. Both `a` and `b` reference the exact same list.\n\nTo create an independent copy:\n- `b = a.copy()` or `b = a[:]` (shallow copy)\n- `b = copy.deepcopy(a)` for nested structures\n\nThink of variables as name tags attached to objects, not boxes containing values.",
      author: { name: "Prof. Chen", role: "instructor" },
      created: "2026-02-27T14:30:00Z",
      isEndorsed: true,
    },
    followups: [
      {
        id: "f13-1",
        content: "This also applies to dictionaries and other mutable objects, right?",
        author: { name: "Priya Patel", role: "student" },
        created: "2026-02-27T15:00:00Z",
        replies: [
          {
            id: "f13-1-1",
            content: "Correct! Any mutable object (lists, dicts, sets) behaves this way with assignment. Immutable objects (strings, tuples, numbers) don't have this issue since you can't modify them in place.",
            author: { name: "Prof. Chen", role: "instructor" },
            created: "2026-02-27T15:15:00Z",
            replies: [],
          },
        ],
      },
    ],
    isInstructorEndorsed: false,
  },
  {
    id: "post-14",
    number: 14,
    type: "question",
    title: "How to debug recursive functions?",
    content:
      "I'm having trouble understanding why my recursive function isn't working. Is there a good way to debug recursion? Adding print statements everywhere makes the output really confusing.",
    created: "2026-02-28T16:00:00Z",
    author: { name: "Sam Torres", role: "student" },
    tags: ["recursion", "debugging", "tips"],
    folders: ["general"],
    status: "unanswered",
    visibility: "entire_class",
    viewCount: 67,
    followupCount: 1,
    studentAnswer: undefined,
    instructorAnswer: undefined,
    followups: [
      {
        id: "f14-1",
        content: "I add an indent parameter to track depth. Like:\n```python\ndef fib(n, depth=0):\n    print('  ' * depth + f'fib({n})')\n    ...\n```\nIt makes the call tree visible!",
        author: { name: "Priya Patel", role: "student" },
        created: "2026-02-28T16:30:00Z",
        replies: [],
      },
    ],
    isInstructorEndorsed: false,
  },
  {
    id: "post-15",
    number: 15,
    type: "note",
    title: "Office Hours Schedule Change - Week 7",
    content:
      "My Wednesday office hours for Week 7 are moved to Thursday 3-5pm due to a faculty meeting. Thursday office hours will run 10-12pm AND 3-5pm.",
    created: "2026-03-01T08:00:00Z",
    author: { name: "Prof. Chen", role: "instructor" },
    tags: ["office-hours", "logistics"],
    folders: ["logistics"],
    status: "open",
    visibility: "entire_class",
    viewCount: 156,
    followupCount: 0,
    studentAnswer: undefined,
    instructorAnswer: undefined,
    followups: [],
    isInstructorEndorsed: false,
  },
]

// Helper: get only student-visible posts
export function getVisiblePosts(): PiazzaPost[] {
  return piazzaPosts.filter((p) => p.visibility === "entire_class")
}

// Helper: get only student-visible materials
export function getVisibleMaterials(): CourseMaterial[] {
  return courseMaterials.filter((m) => m.visible)
}

// Helper: get all unique folders
export function getFolders(): string[] {
  const folders = new Set<string>()
  piazzaPosts.forEach((p) => {
    if (p.visibility === "entire_class") {
      p.folders.forEach((f) => folders.add(f))
    }
  })
  return Array.from(folders).sort()
}

// NEW STUFF


// Trending topics derived from common questions
export const trendingTopics: TrendingTopic[] = [
  {
    id: "trend-1",
    topic: "Recursion basics",
    askCount: 28,
    sampleQuestion: "I'm struggling to understand how recursion works. Can you help me break it down?",
    relatedPostIds: ["post-6", "post-7", "post-9"],
  },
  {
    id: "trend-2",
    topic: "Lists vs tuples",
    askCount: 19,
    sampleQuestion: "What's the difference between a list and a tuple in Python?",
    relatedPostIds: ["post-10", "post-11"],
  },
  {
    id: "trend-3",
    topic: "Variable scope",
    askCount: 15,
    sampleQuestion: "Why am I getting 'variable not defined' errors when I use a variable outside a function?",
    relatedPostIds: ["post-5"],
  },
  {
    id: "trend-4",
    topic: "HW3 hints",
    askCount: 12,
    sampleQuestion: "I'm stuck on HW3 Problem 1. Can you give me some guidance without spoiling the answer?",
    relatedPostIds: ["post-6", "post-9"],
  },
]

// Instructor/TA availability status
export const instructorStatus: InstructorStatus = {
  isOnline: true,
  activeHours: "Mon/Wed 2-4pm, Thu 10-12pm",
  averageResponseTime: "Usually responds within 2 hours",
  nextAvailable: "Online now",
}

// Weekly availability schedule
export const availabilitySchedule: AvailabilitySlot[] = [
  {
    day: "monday",
    startTime: "14:00",
    endTime: "16:00",
    type: "office_hours",
    person: "instructor",
    name: "Prof. Chen",
  },
  {
    day: "wednesday",
    startTime: "14:00",
    endTime: "16:00",
    type: "office_hours",
    person: "instructor",
    name: "Prof. Chen",
  },
  {
    day: "thursday",
    startTime: "10:00",
    endTime: "12:00",
    type: "online",
    person: "ta",
    name: "Sarah (TA)",
  },
  {
    day: "friday",
    startTime: "15:00",
    endTime: "17:00",
    type: "office_hours",
    person: "ta",
    name: "Sarah (TA)",
  },
]

// Example resolved instructor request
export const mockInstructorRequests: InstructorRequest[] = [
  {
    id: "req-1",
    messageId: "msg-example-1",
    originalQuestion: "How do I implement bubble sort?",
    aiResponse: "Think about comparing adjacent elements and consider when you might need to swap them...",
    reasons: ["too_vague"],
    notes: "I tried comparing elements but I still don't understand when exactly to swap them.",
    status: "resolved",
    createdAt: "2026-04-09T10:30:00Z",
    resolvedAt: "2026-04-09T11:45:00Z",
    responderName: "Sarah (TA)",
    responderRole: "ta",
    instructorReply: "Great question! The key insight is that you swap whenever the left element is GREATER than the right. Here's a visual: [5, 3, 8, 1] - compare 5 and 3, since 5 > 3, swap them - [3, 5, 8, 1]. Then compare 5 and 8, no swap needed since 5 < 8. Does that help clarify?",
  },
]
