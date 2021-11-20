$(document).ready(function () {
	let pieces = createPieces(true);

	$('#puzzleContainer').html(pieces);


	let timer;


	$('#btnStart').click(function () {
		$('#btnCheck').prop('disabled', false);
		$('.modal-timer').show();
		$('#checkResult').show();
		$('.modal-text').text('Are you sure? There is still time!');

		let pieces = $('#puzzleContainer div');
		pieces.each(function () {
			let leftPosition = Math.floor(Math.random() * 290) + 'px';
			let topPosition = Math.floor(Math.random() * 290) + 'px';
			$(this).addClass('draggablePiece').css({
				position: 'absolute',
				left: leftPosition,
				top: topPosition
			});
			$('#pieceContainer').append($(this));
		});

		let emptyBox = createPieces(false);

		$('#puzzleContainer').html(emptyBox);
		$(this).hide();
		$('#btnReset').show();
		implimentLogic();


		timer = setInterval(updateCountdown, 1000);
		let startingMinutes = '1';

		let time = startingMinutes * 60;

		function updateCountdown() {
			time--
			let minutes = Math.floor(time / 60);
			let seconds = time % 60;

			if (minutes === 0 && seconds === 00) {
				minutes = 1;
				seconds = 0;
				clearInterval(timer);
				checkIfSolved();
			}
			$('#countdown').html(`${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
			$('.modal-timer').text(`${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
		}
	});

	function implimentLogic() {
		$('.draggablePiece').draggable({
			revert: 'invalid',
			start: function () {
				if ($(this).hasClass('droppedPiece')) {
					$(this).removeClass('droppedPiece');
					$(this).parent().removeClass('piecePresent');
				}
			}
		});

		$('.droppableSpace').droppable({
			hoverClass: "highlight",
			accept: function () {
				return !$(this).hasClass('piecePresent')
			},
			drop: function (event, ui) {
				let draggableElement = ui.draggable;
				let droppedOn = $(this);
				droppedOn.addClass('piecePresent');
				$(draggableElement).addClass('droppedPiece').css({
					top: 0,
					left: 0,
					position: 'relative'
				}).appendTo(droppedOn);
			}
		});
	}

	function checkIfSolved() {
		if ($('#puzzleContainer .droppedPiece').length != 16) {
			$('.modal-text').text('Sorry, but you are loser!');
			checkPieces();
			return false;
		}
		for (let k = 0; k < 16; k++) {
			let item = $("#puzzleContainer .droppedPiece:eq(" + k + ")");
			let order = item.data("order");
			if (k != order) {
				$('.modal-text').text('Sorry, but you are loser!');
				checkPieces();
				$('#countdown').html(`01:00`);
				return false;
			}
		}
		$('.modal-text').text('You are Genius!!!');
	}

	function createPieces(withImage) {
		let rows = 4,
			columns = 4;
		let pieces = '';
		for (let r = 0, top = 0, order = 0; r < rows; r++, top -= 100) {
			for (let c = 0, left = 0; c < columns; c++, left -= 100, order++) {
				if (withImage) {
					pieces += "<div style='background-position:" + left + "px " + top + "px;' class = 'piece' data-order = " + order + " ></div>";
				} else {
					pieces += "<div style = 'background-image: none' class = 'piece droppableSpace'></div>";
				}
			}
		}
		return pieces;
	}

	function checkPieces() {
		let newPieces = createPieces(true);
		$('#puzzleContainer').html(newPieces);
		$('#btnReset').hide();
		$('#btnStart').show();
		$('#btnCheck').prop('disabled', true);

		$('#pieceContainer').empty();
	}

	$('#btnReset').on('click', function () {
		location.reload();
	});

	$('#checkResult').on('click', function () {
		checkIfSolved();
		clearInterval(timer);
		$('.modal-timer').hide();
		$('#checkResult').hide();
		$('#countdown').html('01:00');
	});

	$('#close').on('click', function () {
		$('.modal').animate({
			top: `-250px`,
		}, 500, 'linear', function(){
			$('.background').css('display', 'none');
		});
		// $('.modal').slideUp(1000, function(){
		// 	$('.background').css('display', 'none');
		// });
	})

	$('#btnCheck').on('click', function () {
		$('.background').css('display', 'block');
		$('.modal').css('display', 'flex');
		$('.modal').animate({
			top: `70px`,
		}, 500, 'linear');
		// $('.modal').slideDown(1000);
	});

})