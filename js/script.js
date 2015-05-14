$( document ).ready( function() {
	var preview = $( '.preview' );
	var status = $( '.status' );

	var progress = $( '.progress' );
	var percent = $( '.percent' );
	var bar = $( '.bar' );

	var file = $( '#file' );
	var pdf = $( '#pdf' );

	var hideImage = function () {
		if ( ! pdf.is( ':hidden' ) )
			pdf.fadeOut( 200 );
		else
			preview.fadeOut( 200 );
	};

	$( '#image' ).change( function () {
		if ( ! $( this ).val() )
			return ;
		hideImage();

		var oFReader = new FileReader();
		oFReader.readAsDataURL( document.getElementById( 'image' ).files[ 0 ] );

		oFReader.onload = function ( oFREvent ) {
			file.fadeOut( 200 );
			if ( oFREvent.target.result.split( ';' )[ 0 ].split( ':' ).pop() == 'application/pdf' )
				pdf.delay( 200 ).fadeIn();
			else
				preview.attr( 'src', oFREvent.target.result ).delay( 200 ).fadeIn();
		};
	} );

	$( 'form' ).submit( function () {
		if ( $( '#image' ).val() == '')
		{
			alert( 'Veuillez sélectionner un fichier avant tout.' );
			return ( false );
		}
	} ).ajaxForm( {
		dataType:  'json',

		beforeSend: function() {
			status.css( 'background', '#f47063' );
			status.fadeOut();
			bar.width( '0%' );
			percent.html( '0%' );
			if ( progress.is( ':hidden' ) )
				progress.fadeIn();
		},

		uploadProgress: function( event, position, total, percentComplete ) {
			var pVel = percentComplete + '%';
			bar.width( pVel );
			percent.html( pVel );
		},

		complete: function( data ) {
			hideImage();
			file.fadeIn();

			if ( data.responseJSON.code )
			{
				status.css( 'background', '#55c752' );
				$( '#print2code' ).text( data.responseJSON.code );
				modal.open();
			}

			status.html( data.responseJSON.status ).fadeIn();
			$( '#image' ).val( '' );
		}
	} );

	var modal = new RModal( document.getElementById( 'modal' ) );
	$( window ).on( 'keydown', function( ev ) {
		if ( ev.which == 27 )
			modal.close();
	} );

	window.modal = modal;
} );
