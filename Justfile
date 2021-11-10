alias n := new

new TITLE:
    hugo new ./content/posts/{{TITLE}}/index.md

serve:
    hugo server
