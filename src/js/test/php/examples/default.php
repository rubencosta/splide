<?php
require_once '../parts.php';
require_once '../settings.php';

$settings = get_settings();
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <title>Default</title>

  <link rel="stylesheet" href="../../../../../dist/css/themes/splide-<?php echo $settings['theme'] ?>.min.css">
  <link rel="stylesheet" href="../../assets/css/styles.css">
  <script type="text/javascript" src="../../../../../dist/js/splide.js"></script>

<!--	https://cdn.jsdelivr.net/npm/@splidejs/splide@3.6.12/dist/js/splide.min.js-->

  <script>
    document.addEventListener( 'DOMContentLoaded', function () {
      var splide = new Splide( '#splide01', {
	      width       : 800,
	      // type        : 'loop',
	      perPage     : 3,
	      rewind      : true,
	      rewindByDrag: true,
	      padding     : 40,
	      updateOnMove: true,
	      direction   : 'ltr',
	      height      : undefined,
	      paginationDirection: 'ttb',

	      breakpoints: {
					1200: {
						direction: 'ttb',
						height   : 500,
						perPage  : 2,
					},
		      1000: {
						destroy: true,
		      }
	      }
      } );

	    // splide.on( 'move', function () {
		  //   console.log( 'move' );
	    // } );
	    //
      // splide.on( 'moved', function ( index, prev, dest ) {
      //   console.log( 'moved', index, prev, dest );
      // } );
	    //
      // splide.on( 'visible', Slide => {
      //   console.log( 'visible', Slide );
      // } );
	    //
      // splide.on( 'hidden', Slide => {
      //   console.log( 'hidden', Slide );
      // } );
	    //
      // splide.on( 'click', function () {
      //   console.log( 'click' );
      // } );
	    //
      // splide.on( 'shifted', function () {
      //   console.log( 'shifted' );
      // } );
	    //
	    // splide.on( 'drag', function () {
		  //   console.log( 'drag' );
	    // } );
	    //
	    // splide.on( 'dragged', function () {
		  //   console.log( 'dragged' );
	    // } );

      splide.mount();

	    const pre = document.querySelector( 'pre' );

	    // Array.from( document.getElementsByTagName( 'button' ) ).forEach( button => {
			// 	button.addEventListener( 'click', function () {
			// 		alert( 'click' );
			// 	} );
			// } );

			// console.log = ( ...args ) => {
			// 	pre.textContent = args.join( ' ' ) + '\n' + pre.textContent;
			// };
    } );
  </script>

  <style>
    body {
      margin: 50em 0;
    }
  </style>
</head>
<body>

<?php render( 'splide01', 10 ); ?>

<pre></pre>

</body>
</html>
