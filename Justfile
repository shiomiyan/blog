alias n := new

new TITLE:
    hugo new posts/{{TITLE}}/index.md

serve:
    hugo server
