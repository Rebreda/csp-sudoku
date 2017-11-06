$(document)
    .ready(() => {
        let init = (board, solve) => {
            console.log(board);
            window.board = board;
            let before = buildCons(buildBoard(board));

            if (solve) {
                let nodes = AC3(before);
                console.log("vs", nodes)
            }
            printBoard(before);
            // console.log();

            $("#do")
                .on("click", () => {

                    init(window.board, true);
                });

            $("div.sq input")
                .on("keydown", (e) => {
                    console.log("asd");
                    let asd = '';
                    document.querySelectorAll("input")
                        .forEach((e) => {
                            asd += $(e)
                                .val();
                        });
                    window.board = asd;
                    console.log(board);
                });

            $("#str")
                .on("change", (e) => {
                    window.board = '';
                    console.log(e.currentTarget.value);
                    // board = e.currentTarget.value;
                    window.board = e.currentTarget.value.replace(/\s/g, '');

                    console.log(board);
                });


        };



        init(`000000907
    000420180
    000705026
    100904000
    050000040
    000507009
    920108000
    034059000
    507000000`, false);
  });